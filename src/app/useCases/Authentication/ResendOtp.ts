import { ResponseDTO } from "@/domain/dtos/Response";

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
     * @param {string} email - Email address of the user.
     * @returns {Promise<ResponseDTO>}
     */
    execute(email : string) : Promise<ResponseDTO>

}