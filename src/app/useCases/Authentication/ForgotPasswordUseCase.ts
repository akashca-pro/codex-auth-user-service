import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * Interface for the use case of forgotpassword.
 *
 * This interface defines the contract for a use case responsible for issuing
 * otp for reset password for local auth users.
 *
 * @interface
 */
export interface IForgotPasswordUseCase {

    /**
     * Execute the ForgotPasswordUseCase.
     * 
     * @param {string} email - The email address of the user.
     * @returns {Promise<ResponseDTO>} - The response data.
     * 
     * @remarks
     * This method is responsible for handling the logic of issuing otp for verifying
     * for reset password for local auth users based on the email of the user.
     */
    execute(email : string) : Promise<ResponseDTO> 

}