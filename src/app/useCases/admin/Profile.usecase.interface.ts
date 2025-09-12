import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * Interface for the use case of Profile data retrieval of the admin.
 *
 * This interface defines the contract for a use case responsible for sending
 * the admin profile details.
 * 
 * @interface
 */
export interface IProfileUseCase{


    /**
     * Executes the Profile use case.
     * 
     * @param {string} userId - The id of the admin.
     * @returns {ResponseDTO} - The response of the admin.
     * 
     * @remarks
     * This method is responsible for handling the logic of creation
     * of a new admin.
     */
    execute(userId : string) : Promise<ResponseDTO>

}