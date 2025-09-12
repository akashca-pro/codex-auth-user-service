import { ResponseDTO } from "@/domain/dtos/Response";
import { IChangePassRequestDTO } from "@/domain/dtos/User/ChangePass.dto";


/**
 * Interface defines the contract for the change password use case.
 * 
 * @interface
 */
export interface IChangePassUseCase {

    /**
     * Executes the change password use case.
     * 
     * @param {userId} userId - The unique userId
     * @param {IChangePassRequestDTO} payload - This payload contains currpass and newpass.
     */
    execute(userId : string, payload : IChangePassRequestDTO) : Promise<ResponseDTO>

}