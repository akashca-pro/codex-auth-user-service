import { IUserRepository } from "@/app/repository/User";
import { IVerifySignUpOtpUseCase } from "../VerifySignup";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { ITokenService } from "@/app/providers/GenerateTokens";
import { IVerifySignUpOtp } from "@/domain/dtos/Authenticate/VerifyOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { User } from "@/domain/entities/User";
import { UserRole } from "@/domain/enums/UserRole";


/**
 * Use case for verifying user signup otp.
 * 
 * @class
 * @implements {IVerifySignUpOtpUseCase}
 */
export class VerifySignUpOtpUseCase implements IVerifySignUpOtpUseCase {

    /**
     * Creates an instance of VerifySignUpOtpUseCase.
     * 
     * @async
     * @param userRepository - The repository of the user.
     * @param otpService - Otp service provider for verification.
     * @param tokenService - Token service provider for generating token.
     */
    constructor (
        private userRepository : IUserRepository,
        private otpService : IOtpService,
        private tokenService : ITokenService
    ){}

    /**
     * 
     * @param  {IVerifySignUpOtp} credentials - The user credentials for veriying otp
     * @returns {ResponseDTO} - The response data.
     */
    async execute({ email, otp }: IVerifySignUpOtp): Promise<ResponseDTO> {
        try {
            const user = this.userRepository.findByEmail(email) 
            
            if(!user){
                return {data : { message : AuthenticateUserErrorType.AccountNotFount }, success : false}
            }

            const isOtpVerified = await this.otpService.verifyOtp(email,OtpType.SIGNUP,otp);

            if(!isOtpVerified){
                return {data : {message : AuthenticateUserErrorType.InvalidOrExpiredOtp}, success : false}
            }

            const updatedEntity = User.update({
                role : UserRole.USER,
                isVerified : true,
                updatedAt : new Date(),
            })
            
        } catch (error) {
            return { data : { message : SystemErrorType.InternalServerError } , success : false }
        }
    }

}