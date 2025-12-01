import { ResponseDTO } from "@/domain/dtos/Response";
import { ResetPasswordRequest } from "@akashcapro/codex-shared-utils";

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
     * @param request - Request payload contains email, new password and otp.
     * @returns {Promise<ResponseDTO>} - The response data.
     * 
     * @remarks
     * This method is responsible for handling the logic of validating otp
     * and reset the current password.
     */
    execute(request : ResetPasswordRequest) : Promise<ResponseDTO>
}