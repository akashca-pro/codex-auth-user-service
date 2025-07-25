import { IVerifySignUpOtp } from "@/domain/dtos/Authenticate/VerifyOtp";
import { ResponseDTO } from "@/domain/dtos/Response";


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
     * @param {IVerifySignUpOtp} credentials - The user credentials for verification.
     * @returns {Promise<ResponseDTO>} - The response data.
     */
    execute({email, otp} : IVerifySignUpOtp) : Promise<ResponseDTO>;
}