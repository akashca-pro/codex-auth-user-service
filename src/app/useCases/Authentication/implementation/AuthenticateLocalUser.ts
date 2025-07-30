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
import logger from "@/utils/logger";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { randomUUID } from "node:crypto";
import { UserRole } from "@/domain/enums/UserRole";

/**
 * Use case for authenticating a user.
 * 
 * @class
 * @implements {IAuthenticateLocalAuthUserUseCase}
 */
@injectable()
export class AuthenticateLocalUserUseCase implements IAuthenticateLocalAuthUserUseCase {
    /**
     * Creates an instance of AuthenticateUserUseCase.
     * 
     * @param {IUserRepository} _userRepository - The repository of the user.
     * @param {IPasswordHasher} _passwordHasher - The password hasher provider for comparing hashed password.
     * @param {ITokenProvider} _tokenProvider - Token service provider for generating token.
     * @param {IOtpService} _otpService - Otp service provider for verification.
     * @contructor
     */
    constructor(
        @inject(TYPES.IUserRepository)
        private _userRepository : IUserRepository,

        @inject(TYPES.IPasswordHasher)
        private _passwordHasher : IPasswordHasher,

        @inject(TYPES.ITokenProvider)
        private _tokenProvider : ITokenProvider,

        @inject(TYPES.IOtpService)
        private _otpService : IOtpService
    ){}

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

        try {
        const user = (await this._userRepository.findByEmailAndRole(
            email,
            role
        ))

        if(!user){
            return {
                data : { message : AuthenticateUserErrorType.EmailOrPasswordWrong },
                success : false,
            }
        }

        if(user.authProvider !== AuthProvider.LOCAL || user.password === null){
            return {
                data : { message : AuthenticateUserErrorType.AuthProviderWrong },
                success : false,
            }
        }

        const passwordMatch = await this._passwordHasher.comparePasswords(password,user.password);

        if(!passwordMatch){
            return {
                data : { message : AuthenticateUserErrorType.EmailOrPasswordWrong },
                success : false,
            }
        }

        if(!user.isVerified){
            await this._otpService.clearOtp(email, OtpType.SIGNUP);
            await this._otpService.generateAndSendOtp(email, OtpType.SIGNUP);
            return {
                data : { message : AuthSuccessType.VerificationOtpSend },
                success : false
            }
        }

        const payload : ITokenPayLoadDTO = {
            userId : user.userId,
            email : user.email,
            role : user.role,
            tokenId : randomUUID()
        }

        const accessToken = this._tokenProvider.generateAccessToken(payload);
        const refreshToken = this._tokenProvider.generateRefreshToken(payload);

        return { 
            data : { accessToken, 
                refreshToken, 
                message : AuthSuccessType.AuthenticationSuccess,
                userInfo : {
                    userId : user.userId,
                    email : user.email,
                    role : user.role
                } 
            },
            success : true
         }

        } catch (error : any) {
            logger.error(error);
            return { data : { message : SystemErrorType.InternalServerError } , success : false };
        }

    }
}

