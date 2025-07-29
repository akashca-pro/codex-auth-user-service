import TYPES from "@/config/inversify/types";
import { IUserRepository } from "@/app/repository/User";
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

    /**
     * Creates an instance of VerifySignUpOtpUseCase.
     * 
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IOtpService} otpService - Otp service provider for verification.
     * @param {ITokenProvider} tokenProvider - Token service provider for generating token.
     */
    constructor (
        @inject(TYPES.IUserRepository)
        private userRepository : IUserRepository,

        @inject(TYPES.ITokenProvider)
        private tokenProvider : ITokenProvider,

        @inject(TYPES.IOtpService)
        private otpService : IOtpService
    ){}

    /**
     * Executes the VerifySignupOtp use case.
     * 
     * @param  {IVerifySignUpOtp} credentials - The user credentials for veriying otp
     * @returns {ResponseDTO} - The response data.
     */
    async execute({ email, otp }: IVerifySignUpOtp): Promise<ResponseDTO> {
        try {
            const user = await this.userRepository.findByEmail(email) 
            
            if(!user){
                return {data : { message : AuthenticateUserErrorType.AccountNotFound }, success : false}
            }

            const isOtpVerified = await this.otpService.verifyOtp(email,OtpType.SIGNUP,otp);

            if(!isOtpVerified){
                return {data : {message : AuthenticateUserErrorType.InvalidOrExpiredOtp}, success : false}
            }

            const userEntity = User.rehydrate(user);
            userEntity.update({isVerified : true});
            console.log(userEntity.getUpdatedFields());
            const res = await this.userRepository.update(user.userId,userEntity.getUpdatedFields());
            console.log(res);
            await this.otpService.clearOtp(email,OtpType.SIGNUP);

            const payload : ITokenPayLoadDTO = {
                userId : user.userId,
                email : user.email,
                role : UserRole.USER,
                tokenId : randomUUID()
            }

            const accessToken = this.tokenProvider.generateAccessToken(payload);
            const refreshToken = this.tokenProvider.generateRefreshToken(payload);

            if(!accessToken) throw new Error(UserErrorType.AccessTokenIssueError);
            if(!refreshToken) throw new Error(UserErrorType.RefreshTokenIssueError);

            return { 
                data : { 
                    accessToken,
                    refreshToken,
                    message : UserSuccessType.SignupSuccess,
                    userInfo : {
                    userId : user.userId,
                    email : user.email,
                    role : user.role
                    }
                 },    
                success : true
            }
       
        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }
    }

}