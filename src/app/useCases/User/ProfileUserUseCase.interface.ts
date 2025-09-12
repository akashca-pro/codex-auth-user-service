import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * Interface for the use case of Profile data retrieval of the user.
 *
 * This interface defines the contract for a use case responsible for sending
 * the user profile details.
 * 
 * @interface
 */
export interface IProfileUseCase{


    /**
     * Executes the Profile use case.
     * 
     * @param {string} userId - The id of the user.
     * @returns {ResponseDTO} - The response of the user.
     * 
     * @remarks
     * This method is responsible for handling the logic of creation
     * of a new user.
     */
    execute(userId : string) : Promise<ResponseDTO>

}