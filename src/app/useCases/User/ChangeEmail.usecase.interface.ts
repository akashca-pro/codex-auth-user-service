import { ResponseDTO } from "@/domain/dtos/Response";
import { ChangeEmailRequest } from "@akashcapro/codex-shared-utils";

/**
 * Interface defines the contract for the change email use case.
 * 
 * @interface
 */
export interface IChangeEmailUseCase {

    /**
     * Executes the change email use case.
     * 
     * @param request - Request payload contain userId, newEmail, password
     */
    execute(
        request : ChangeEmailRequest
    ) : Promise<ResponseDTO>
}