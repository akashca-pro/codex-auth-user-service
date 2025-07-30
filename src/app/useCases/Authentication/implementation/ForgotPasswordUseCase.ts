import TYPES from "@/config/inversify/types";
import { IUserRepository } from "@/domain/repository/User";
import { IForgotPasswordUseCase } from "../ForgotPasswordUseCase";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { OtpType } from "@/domain/enums/OtpType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { injectable, inject } from "inversify";

/**
 * Use case of Forgotpassword use case.
 *  
 * @class
 * @implements {IForgotPasswordUseCase}
 */
@injectable()
export class ForgotpasswordUseCase implements IForgotPasswordUseCase {
 
    /**
     * Creates an instance of ForgotpasswordUseCase.
     * 
     * 
     * @param {IUserRepository} _userRepository - The repository of the user.
     * @param {IOtpService} _otpService -  - Otp service provider for generate and sent otp.
     */
    constructor(
        @inject(TYPES.IUserRepository)
        private _userRepository : IUserRepository,

        @inject(TYPES.IOtpService)
        private _otpService : IOtpService
    ){}

    /**
     * @async
     * @param {string} email 
     */
    async execute(email: string): Promise<ResponseDTO>{
        try {
            const user = this._userRepository.findByEmail(email);

            if(!user){
                return {data : { message : AuthenticateUserErrorType.AccountNotFound }, success : false}
            }

            await this._otpService.generateAndSendOtp(email, OtpType.FORGOT_PASS);

            return {
                data : { message : UserSuccessType.OtpSendSuccess },
                success : true
            }

        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }
    }
    
}
