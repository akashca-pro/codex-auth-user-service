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

/**
 * Use case for authenticating a user.
 * 
 * @class
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
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
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

    /**
     * Executes the local authentication use case.
     * 
     * @param {IAuthenticateLocalAuthUserDTO} credentials - The user credentials for authentication.
     * @returns {Promise<ResponseDTO>} - The response data. 
     */
    async execute({
        email,
        password,
        role
    } : IAuthenticateLocalAuthUserDTO) : Promise<ResponseDTO> {

        const user = await this.#_userRepository.findByEmailAndRole(
            email,
            role
        )

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false,
            }
        }

        if(user.authProvider !== AuthProvider.LOCAL || user.password === null){
            return {
                data : null,
                message : AuthenticateUserErrorType.AuthProviderWrong,
                success : false,
            }
        }

        const passwordMatch = await this.#_passwordHasher.comparePasswords(password,user.password);

        if(!passwordMatch){
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false,
            }
        }

        if(!user.isVerified){
            await this.#_otpService.clearOtp(email, OtpType.SIGNUP);
            await this.#_otpService.generateAndSendOtp(email, OtpType.SIGNUP);
            return {
                data : null,
                message : AuthSuccessType.VerificationOtpSend,
                success : false
            }
        }

        const payload : ITokenPayLoadDTO = {
            userId : user.userId,
            email : user.email,
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
                    email : user.email,
                    role : user.role,
                    avatar : user.avatar ?? null
                }
            },
            message : AuthSuccessType.AuthenticationSuccess, 
            success : true
         }
    }
}

