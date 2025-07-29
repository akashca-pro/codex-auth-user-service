import TYPES from "@/config/inversify/types";
import { injectable, inject } from "inversify";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { IUserRepository } from "@/app/repository/User";
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
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IPasswordHasher} passwordHasher - The password hasher provider for comparing hashed password.
     * @param {ITokenProvider} tokenProvider - Token service provider for generating token.
     * @param {IOtpService} otpService - Otp service provider for verification.
     * @contructor
     */
    constructor(
        @inject(TYPES.IUserRepository)
        private userRepository : IUserRepository,

        @inject(TYPES.IPasswordHasher)
        private passwordHasher : IPasswordHasher,

        @inject(TYPES.ITokenProvider)
        private tokenProvider : ITokenProvider,

        @inject(TYPES.IOtpService)
        private otpService : IOtpService
    ){}

    /**
     * Executes the local authentication use case.
     * 
     * @param {IAuthenticateLocalAuthUserDTO} credentials - The user credentials for authentication.
     * @returns {Promise<ResponseDTO>} - The response data. 
     */
    async execute({
        email,
        password
    } : IAuthenticateLocalAuthUserDTO) : Promise<ResponseDTO> {

        try {
        const user = (await this.userRepository.findByEmail(
            email
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

        const passwordMatch = await this.passwordHasher.comparePasswords(password,user.password);

        if(!passwordMatch){
            return {
                data : { message : AuthenticateUserErrorType.EmailOrPasswordWrong },
                success : false,
            }
        }

        if(!user.isVerified){
            await this.otpService.clearOtp(email, OtpType.SIGNUP);
            await this.otpService.generateAndSendOtp(email, OtpType.SIGNUP);
            return {
                data : { message : AuthSuccessType.VerificationOtpSend },
                success : false
            }
        }

        const payload : ITokenPayLoadDTO = {
            userId : user.userId,
            email : user.email,
            role : user.role
        }

        const accessToken = this.tokenProvider.generateAccessToken(payload);
        const refreshToken = this.tokenProvider.generateRefreshToken(payload);

        return { 
            data : { accessToken, 
                refreshToken, 
                message : AuthSuccessType.AuthenticationSuccess,
                userInfo : payload },
            success : true
         }

        } catch (error : any) {
            logger.error(error);
            return { data : { message : SystemErrorType.InternalServerError } , success : false };
        }

    }
}

