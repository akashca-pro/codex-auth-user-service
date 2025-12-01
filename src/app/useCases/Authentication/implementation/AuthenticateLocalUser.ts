import TYPES from "@/config/inversify/types";
import { injectable, inject } from "inversify";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { IUserRepository } from "@/domain/repository/User";
import { IAuthenticateLocalAuthUserDTO } from "@/domain/dtos/Authenticate/AuthenticateUser";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { AuthProvider } from "@/domain/enums/AuthProvider";
import { OtpType } from "@/domain/enums/OtpType";
import { IAuthenticateLocalAuthUserUseCase } from "../AuthenticateLocalAuthUser";
import { AuthSuccessType } from "@/domain/enums/authenticateUser/SuccessType";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { randomUUID } from "node:crypto";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Use case for authenticating a user.
 * * @class
 * @implements {IAuthenticateLocalAuthUserUseCase}
 */
@injectable()
export class AuthenticateLocalUserUseCase implements IAuthenticateLocalAuthUserUseCase {

    #_userRepository : IUserRepository
    #_passwordHasher : IPasswordHasher
    #_tokenProvider : ITokenProvider
    #_otpService : IOtpService

    /**
     * Creates an instance of AuthenticateUserUseCase.
     * * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IPasswordHasher} passwordHasher - The password hasher provider for comparing hashed password.
     * @param {ITokenProvider} tokenProvider - Token service provider for generating token.
     * @param {IOtpService} otpService - Otp service provider for verification.
     * @contructor
     */
    constructor(
        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository,

        @inject(TYPES.IPasswordHasher)
        passwordHasher : IPasswordHasher,

        @inject(TYPES.ITokenProvider)
        tokenProvider : ITokenProvider,

        @inject(TYPES.IOtpService)
        otpService : IOtpService
    ){
        this.#_userRepository = userRepository,
        this.#_passwordHasher = passwordHasher,
        this.#_tokenProvider = tokenProvider,
        this.#_otpService = otpService
    }

    async execute(
        request : IAuthenticateLocalAuthUserDTO
    ) : Promise<ResponseDTO> {
        // Log 1: Execution start
        logger.info('AuthenticateLocalUserUseCase execution started', { email: request.email, role: request.role });
        
        const user = await this.#_userRepository.findByEmailAndRole(
            request.email,
            request.role
        )

        if(!user || user.isArchived){
            // Log 2A: User not found or archived
            logger.warn('Authentication failed: user not found or archived', { email: request.email, role: request.role });
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false,
            }
        }

        if(user.isBlocked){
            // Log 2B: Account blocked
            logger.warn('Authentication failed: account is blocked', { userId: user.userId, email: user.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountBlocked,
                success : false
            }
        }

        if(user.authProvider !== AuthProvider.LOCAL || user.password === null){
            // Log 2C: Wrong auth provider
            logger.warn('Authentication failed: wrong auth provider', { userId: user.userId, email: user.email, currentProvider: user.authProvider });
            return {
                data : null,
                message : AuthenticateUserErrorType.AuthProviderWrong,
                success : false,
            }
        }

        const passwordMatch = await this.#_passwordHasher.comparePasswords(
            request.password,
            user.password
        );

        if(!passwordMatch){
            // Log 2D: Password mismatch
            logger.warn('Authentication failed: password mismatch', { userId: user.userId, email: user.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false,
            }
        }

        if(!user.isVerified){
            // Log 2E: User unverified, resending OTP
            logger.info('User unverified, clearing old OTP and resending new one', { userId: user.userId, email: user.email });
            
            await this.#_otpService.clearOtp(
                request.email, 
                OtpType.SIGNUP
            );
            await this.#_otpService.generateAndSendOtp(
                request.email, 
                OtpType.SIGNUP
            );
            return {
                data : null,
                message : AuthSuccessType.VerificationOtpSend,
                success : false
            }
        }
        
        // Log 3: Authentication success, generating tokens
        logger.info('Authentication successful, generating tokens', { userId: user.userId, email: user.email, role: user.role, username : user.username });

        const payload : ITokenPayLoadDTO = {
            userId : user.userId,
            email : user.email,
            username : user.username,
            role : user.role,
            tokenId : randomUUID()
        }
        const accessToken = this.#_tokenProvider.generateAccessToken(payload);
        const refreshToken = this.#_tokenProvider.generateRefreshToken(payload);

        return { 
            data : { 
                accessToken, 
                refreshToken, 
                userInfo : {
                    userId : user.userId,
                    username : user.username,
                    firstName : user.firstName,
                    email : user.email,
                    role : user.role,
                    avatar : user.avatar ?? null,
                    country : user.country ?? null
                }
            },
            message : AuthSuccessType.AuthenticationSuccess, 
            success : true
         }
    }
}