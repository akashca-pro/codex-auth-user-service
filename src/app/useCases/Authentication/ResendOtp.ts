import { ResponseDTO } from "@/domain/dtos/Response";
import { OtpType } from "@/domain/enums/OtpType";
import { ResendOtpRequest } from "@akashcapro/codex-shared-utils";

/**
 * Interface for the usecase of resent otp during signup.
 * 
 * This interface defines the contract for resending the otp which provided
 * to the user after creating account.
 * 
 * @interface
 */
export interface IResendOtpUseCase {

    /**
     * Executes the usecase of re-issuing and sending another otp to provided email.
     * 
     * @async
     * @param request - The request payload contains email and otp.
     * @returns {Promise<ResponseDTO>}
     * 
     * @remarks
     * This method is responsible for handling the logic of Resend Otp
     * based on the user email
     */
    execute(
        request : ResendOtpRequest
    ) : Promise<ResponseDTO>

}