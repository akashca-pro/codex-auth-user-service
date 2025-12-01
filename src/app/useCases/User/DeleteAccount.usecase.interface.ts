import { ResponseDTO } from "@/domain/dtos/Response";
import { DeleteAccountRequest } from "@akashcapro/codex-shared-utils";

/**
 * Interface defines the contract for the delete user account use case.
 * 
 * @interface
 */
export interface IDeleteAccountUseCase {
    
    /**
     * Executes the delete account use case.
     * 
     * @param request - Request payload contains userId and password.
     */
    execute(
        request : DeleteAccountRequest
    ) : Promise<ResponseDTO>

}