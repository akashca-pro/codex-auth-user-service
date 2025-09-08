import { IListUsersDTO } from "@/domain/dtos/admin/ListUsers.dto";
import { PaginationDTO } from "@/domain/dtos/Pagination";

/**
 * This interface defines the contract for a use case responsible for listing 
 * users for admin.
 * 
 * @interface
 */
export interface IListUsersUseCase {

    /**
     * Executes the List user use case.
     * 
     * @param {IListUsersDTO} filter - The filter to be applied for listing users.
     */
    execute(filter : IListUsersDTO) : Promise<PaginationDTO>

}