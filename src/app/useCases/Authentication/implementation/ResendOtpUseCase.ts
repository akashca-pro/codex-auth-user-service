import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IResendOtpUseCase } from "../ResendOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IUserRepository } from "@/app/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { SystemErrorType } from "@/domain/enums/ErrorType";

/**
 * Use case for resend otp.
 * 
 * @class
 * @implements {IResendOtpUseCase}
 */
export class ResendOtpUseCase implements IResendOtpUseCase {

    /**
     * Creates an instance of ResendOtpUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IOtpService} otpService - Otp service provider for re-issuing otp.
     */
    constructor(
        private userRepository : IUserRepository,
        private otpService : IOtpService
    ){}

    /**
     * Executes the ResendOtpUseCase use case.
     * 
     * @async
     * @param {string} email - Email of the user.
     * @returns {Promise<ResponseDTO>} - The response data.
     */
    async execute(email: string): Promise<ResponseDTO> {
        try {
            const user = await this.userRepository.findByEmail(email);
            
            if(!user){
                return {
                    data : { message : AuthenticateUserErrorType.AccountNotFound },
                    success : false
                }
            }

            if(user.isVerified){
                return {
                    data : { message : UserErrorType.AlreadyVerified },
                    success : false
                }
            }

            await this.otpService.clearOtp(email,OtpType.SIGNUP);
            await this.otpService.generateAndSendOtp(email,OtpType.SIGNUP);

            return { data : { message : UserSuccessType.OtpSendSuccess }, success : true }

        } catch (error) {
            return { data : { message : SystemErrorType.InternalServerError } , success : false }
        }
    }

}
