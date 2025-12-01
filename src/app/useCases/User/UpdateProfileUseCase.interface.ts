import { ResponseDTO } from "@/domain/dtos/Response";
import { UpdateProfileRequest } from "@akashcapro/codex-shared-utils";

/**
 * Interface for the usecase for updating user profile details.
 * 
 * @interface
 */
export interface IUpdateUserProfileUseCase {

    /**
     * Executes the Update user profile use case.
     * 
     * @param request - Request payload contain userId and updated data.
     */
    execute(
        request : UpdateProfileRequest
    ) : Promise<ResponseDTO>
}