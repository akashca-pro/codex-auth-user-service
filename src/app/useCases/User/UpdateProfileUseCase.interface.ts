import { ResponseDTO } from "@/domain/dtos/Response";
import { IUpdateUserProfileRequestDTO } from "@/domain/dtos/User/UpdateUserProfile";

/**
 * Interface for the usecase for updating user profile details.
 * 
 * @interface
 */
export interface IUpdateUserProfileUseCase {

    /**
     * Executes the Update user profile use case.
     * 
     * @param {string} userId - The id of the user.
     * @param {IUpdateUserProfileRequestDTO} data - The profile details to be updated.
     */
    execute(
        userId : string,
        data : IUpdateUserProfileRequestDTO
    ) : Promise<ResponseDTO>

}