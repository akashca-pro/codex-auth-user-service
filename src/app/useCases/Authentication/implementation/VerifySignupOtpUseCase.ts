import TYPES from "@/config/inversify/types";
import { IUserRepository } from "@/domain/repository/User";
import { IVerifySignUpOtpUseCase } from "../VerifySignup";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { IVerifySignUpOtp } from "@/domain/dtos/Authenticate/VerifyOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { User } from "@/domain/entities/User";
import { UserRole } from "@/generated/prisma";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { inject, injectable } from "inversify";
import { randomUUID } from "node:crypto";


/**
 * Use case for verifying user signup otp.
 * 
 * @class
 * @implements {IVerifySignUpOtpUseCase}
 */
@injectable()
export class VerifySignUpOtpUseCase implements IVerifySignUpOtpUseCase {

    #_userRepository : IUserRepository
    #_tokenProvider : ITokenProvider
    #_otpService : IOtpService

    /**
     * Creates an instance of SignupUserUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {ITokenProvider} tokenProvider - The token provider for issueing access and refresh token.
     * @param {IOtpService} otpService - Otp service provider for verification.
     */
    constructor(
        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository,

        @inject(TYPES.ITokenProvider)
        tokenProvider : ITokenProvider,

        @inject(TYPES.IOtpService)
        otpService : IOtpService
    ){
        this.#_otpService = otpService,
        this.#_tokenProvider = tokenProvider,
        this.#_userRepository = userRepository 
    }

    /**
     * Executes the VerifySignupOtp use case.
     * 
     * @param  {IVerifySignUpOtp} credentials - The user credentials for veriying otp
     * @returns {ResponseDTO} - The response data.
     */
    async execute({ email, otp }: IVerifySignUpOtp): Promise<ResponseDTO> {

        const user = await this.#_userRepository.findByEmail(email) 
        
        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        const isOtpVerified = await this.#_otpService.verifyOtp(email,OtpType.SIGNUP,otp);

        if(!isOtpVerified){
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false
            }
        }

        const userEntity = User.rehydrate(user);
        userEntity.update({isVerified : true});
        await this.#_userRepository.update(user.userId,userEntity.getUpdatedFields());
        await this.#_otpService.clearOtp(email,OtpType.SIGNUP);

        const payload : ITokenPayLoadDTO = {
            userId : user.userId,
            email : user.email,
            role : UserRole.USER,
            tokenId : randomUUID()
        }

        const accessToken = this.#_tokenProvider.generateAccessToken(payload);
        const refreshToken = this.#_tokenProvider.generateRefreshToken(payload);

        if(!accessToken) throw new Error(UserErrorType.AccessTokenIssueError);
        if(!refreshToken) throw new Error(UserErrorType.RefreshTokenIssueError);

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
            message : UserSuccessType.SignupSuccess,    
            success : true
        }
    }
}