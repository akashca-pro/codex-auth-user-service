import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * Interface defines the contract for the delete user account use case.
 * 
 * @interface
 */
export interface IDeleteAccountUseCase {
    
    /**
     * Executes the delete account use case.
     * 
     * @param userId - The unique id of the user.
     * @param password - The password of the requested user.
     */
    execute(
        userId : string, 
        password : string
    ) : Promise<ResponseDTO>

}