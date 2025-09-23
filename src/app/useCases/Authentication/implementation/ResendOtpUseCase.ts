import TYPES from "@/config/inversify/types";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IResendOtpUseCase } from "../ResendOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { inject, injectable } from "inversify";
import { ResendOtpRequest } from "@akashcapro/codex-shared-utils";
import { validateOtpType } from "@/dto/resendOtp.dto";

/**
 * Use case for resend otp.
 * 
 * @class
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
        await this.#_otpService.clearOtp(
            dto.email,
            dto.otpType
        );
        await this.#_otpService.generateAndSendOtp(
            dto.email,
            dto.otpType
        );
        return {
            data : null,
            message : UserSuccessType.OtpSendSuccess,
            success : true
        }
    }
}
