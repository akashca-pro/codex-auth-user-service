import { IVerifySignUpOtp } from "@/domain/dtos/Authenticate/VerifyOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { VerifyOtpRequest } from "@akashcapro/codex-shared-utils";


/**
 * Interface for the usecase of verifying the signup otp.
 * 
 * This interface defines the contract for verifying the otp which provided
 * to the user after creating account.
 * 
 * @interface
 */
export interface IVerifySignUpOtpUseCase {

    /**
     * Executes the usecase of verifying signup otp.
     * 
     * @async
     * @param request - Request payload contains email and otp.
     * @returns {Promise<ResponseDTO>} - The response data.
     * 
     * @remarks
     * This method is responsible for handling the logic of verifying the signup otp
     * based on the provided credentials.
     */
    execute(
        request : VerifyOtpRequest
    ) : Promise<ResponseDTO>;
}