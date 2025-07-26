import { IUserRepository } from "@/app/repository/User";
import { IForgotPasswordUseCase } from "../ForgotPasswordUseCase";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { OtpType } from "@/domain/enums/OtpType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";

/**
 * Use case of Forgotpassword use case.
 *  
 * @class
 * @implements {IForgotPasswordUseCase}
 */
export class ForgotpasswordUseCase implements IForgotPasswordUseCase {
 
    /**
     * Creates an instance of ForgotpasswordUseCase.
     * 
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IOtpService} otpService -  - Otp service provider for generate and sent otp.
     */
    constructor(
        private userRepository : IUserRepository,
        private otpService : IOtpService 
    ){}

    /**
     * @async
     * @param {string} email 
     */
    async execute(email: string): Promise<ResponseDTO>{
        try {
            const user = this.userRepository.findByEmail(email);

            if(!user){
                return {data : { message : AuthenticateUserErrorType.AccountNotFound }, success : false}
            }

            await this.otpService.generateAndSendOtp(email, OtpType.FORGOT_PASS);

            return {
                data : { message : UserSuccessType.OtpSendSuccess },
                success : true
            }

        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }
    }
    
}
