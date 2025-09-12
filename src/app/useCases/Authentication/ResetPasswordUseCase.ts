import { IResetPasswordDTO } from "@/domain/dtos/Authenticate/ResetPassword";
import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * Interface for the use case of Reset password.
 *
 * This interface defines the contract for a use case responsible for reseting
 * password for local auth users.
 *
 * @interface
 */
export interface IResetPasswordUseCase {

    /**
     * Executes the Reset password use case.
     * 
     * @async
     * @param {IResetPasswordDTO} credentials
     * @returns {Promise<ResponseDTO>} - The response data.
     * 
     * @remarks
     * This method is responsible for handling the logic of validating otp
     * and reset the current password.
     */
    execute({
        email,
        newPassword,
        otp
    } : IResetPasswordDTO) : Promise<ResponseDTO>

}