import { ToggleBlockUserDTO } from "@/domain/dtos/admin/ToggleBlockUsers.dto";
import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * This interface defines the contract for a use case responsible for toggle 
 * blocking and unblocking users by admin.
 * 
 * @interface
 */
export interface IToggleBlockUserUseCase {

    /**
     * Executes the toggle block user usecase.
     * 
     * @async
     * @param {ToggleBlockUserDTO} data - The user id and bool for toggle block
     */
    execute(data : ToggleBlockUserDTO) : Promise<ResponseDTO>

}