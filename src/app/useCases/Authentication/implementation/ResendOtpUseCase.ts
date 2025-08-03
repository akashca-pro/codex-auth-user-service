import TYPES from "@/config/inversify/types";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IResendOtpUseCase } from "../ResendOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IUserRepository } from "@/domain/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { inject, injectable } from "inversify";

/**
 * Use case for resend otp.
 * 
 * @class
 * @implements {IResendOtpUseCase}
 */
@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase {

    #_userRepository : IUserRepository
    #_otpService : IOtpService
    /**
     * Creates an instance of ResendOtpUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IOtpService} otpService - Otp service provider for re-issuing otp.
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
     * Executes the ResendOtpUseCase use case.
     * 
     * @async
     * @param {string} email - Email of the user.
     * @returns {Promise<ResponseDTO>} - The response data.
     */
    async execute(email: string): Promise<ResponseDTO> {

        const user = await this.#_userRepository.findByEmail(email);
        
        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        if(user.isVerified){
            return {
                data : null,
                message : UserErrorType.AlreadyVerified,
                success : false
            }
        }

        await this.#_otpService.clearOtp(email,OtpType.SIGNUP);
        await this.#_otpService.generateAndSendOtp(email,OtpType.SIGNUP);

        return {
            data : null,
            message : UserSuccessType.OtpSendSuccess,
            success : true
        }
    }
}
