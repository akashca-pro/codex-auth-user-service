import { ResponseDTO } from "@/domain/dtos/Response";
import { ChangePasswordRequest } from "@akashcapro/codex-shared-utils";


/**
 * Interface defines the contract for the change password use case.
 * 
 * @interface
 */
export interface IChangePassUseCase {

    /**
     * Executes the change password use case.
     * 
     * @param request - The request payload contain current and new password.
     */
    execute(request : ChangePasswordRequest) : Promise<ResponseDTO>

}