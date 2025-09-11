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
 
    #_userRepository : IUserRepository
    #_otpService : IOtpService

    /**
     * Creates an instance of ForgotpasswordUseCase.
     * 
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IOtpService} otpService - Otp service provider for generate and sent otp.
     */
    constructor(
        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository,

        @inject(TYPES.IOtpService)
        otpService : IOtpService
    ){
        this.#_userRepository = userRepository,
        this.#_otpService = otpService
    }

    /**
     * @async
     * @param {string} email 
     */
    async execute(email: string): Promise<ResponseDTO>{

        const user = await this.#_userRepository.findByEmail(email);

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        if(user.isBlocked){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountBlocked,
                success : false
            }
        }

        await this.#_otpService.generateAndSendOtp(email, OtpType.FORGOT_PASS);

        return {
            data : null,
            message : UserSuccessType.OtpSendSuccess,
            success : true
        }
    }  
}
