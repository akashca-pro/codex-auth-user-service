import { ResponseDTO } from "@/domain/dtos/Response";
import { IChangeEmailRequestDTO } from "@/domain/dtos/User/ChangeEmail.dto";

/**
 * Interface defines the contract for the change email use case.
 * 
 * @interface
 */
export interface IChangeEmailUseCase {

    /**
     * Executes the change email use case.
     * 
     * @param {userId} userId - The unique userId
     */
    execute(userId : string, payload : IChangeEmailRequestDTO) : Promise<ResponseDTO>
}