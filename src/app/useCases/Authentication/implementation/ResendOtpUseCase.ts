import TYPES from "@/config/inversify/types";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IResendOtpUseCase } from "../ResendOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { inject, injectable } from "inversify";
import { ResendOtpRequest } from "@akashcapro/codex-shared-utils";
import { validateOtpType } from "@/dto/resendOtp.dto";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Use case for resend otp.
 * * @class
 * @implements {IResendOtpUseCase}
 */
@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase {

    #_otpService : IOtpService

    constructor(
        @inject(TYPES.IOtpService)
        otpService : IOtpService
    ){
        this.#_otpService = otpService
    }

    async execute(
        request : ResendOtpRequest
    ): Promise<ResponseDTO> {
        const dto = {
            email : request.email,
            otpType : validateOtpType(request.otpType)
        }
        const { email, otpType } = dto;
        
        // Log 1: Execution start
        logger.info('ResendOtpUseCase execution started', { email, otpType });
        
        // Log 2: Clearing existing OTP
        logger.debug('Clearing existing OTP', { email, otpType });
        await this.#_otpService.clearOtp(
            email,
            otpType
        );
        
        // Log 3: Generating and sending new OTP
        logger.debug('Generating and sending new OTP', { email, otpType });
        await this.#_otpService.generateAndSendOtp(
            email,
            otpType
        );
        
        // Log 4: Execution successful
        logger.info('ResendOtpUseCase completed successfully: new OTP sent', { email, otpType });

        return {
            data : null,
            message : UserSuccessType.OtpSendSuccess,
            success : true
        }
    }
}