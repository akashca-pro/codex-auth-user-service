import { PaginationDTO } from "@/domain/dtos/Pagination";
import { ICreateUserRequestDTO } from "@/domain/dtos/User/CreateUser";
import { IUpdateUserRequestDTO } from "@/domain/dtos/User/UpdateUser";
import { IUserOutRequestDTO } from "@/domain/dtos/User/UserOut";
import { UserRole } from "@/domain/enums/UserRole";

/**
 * Interface for the repository handling user data.
 * 
 * @interface
 */
export interface IUserRepository {

    /**
     * Create a new user with provided data.
     * 
     * @async
     * @param {ICreateUserRequestDTO} data - The user data to be created.
     * @returns {Promise<IUserInRequestDTO>} - The created user data.
     */
    create(data : ICreateUserRequestDTO) : Promise<IUserOutRequestDTO>;

    /**
     * Find a user by their email address and role.
     * 
     * @async
     * @param {string} email - The email address of the user.
     * @param {UserRole} role - The role of the user.
     * @returns {Promse<IUserOutRequestDTO | unknown>} - The found user data or undefined if not.
     */
    findByEmail(email : string, role : UserRole) : Promise<IUserOutRequestDTO | unknown>;

    /**
     * Find a user by their userId and role.
     * 
     * @async
     * @param {string} userId - The id of the user.
     * @param {UserRole} role - The role of the user.
     * @returns { Promise<IUserOutRequestDTO | unknown> } - The found user data or undefined if not.
     */
    findById(userId : string, role  : UserRole) : Promise<IUserOutRequestDTO | unknown>;

    /**
     * Retrieves a paginated list of all users.
     * 
     * @async
     * @param {number} pageNumber - The page number for pagination.
     * @returns {Promise<PaginationDTO>} - The paginated list of users.
     */
    findAll(pageNumber : number) : Promise<PaginationDTO>;


    /**
     * Updated the user data with the provided information.
     * 
     * @async
     * @param {IUserOutRequestDTO} user - The user to be updated.
     * @param {IUpdateUserRequestDTO} data - The updated user data.
     * @returns {Promise<IUserOutRequestDTO>} - The updated user data.
     */
    update(
        user : IUserOutRequestDTO, 
        data : IUpdateUserRequestDTO,
    ) : Promise<IUserOutRequestDTO>;

    /**
     * Delete a user by their id
     * 
     * @async
     * @param {string} userId - The id of the user to be deleted.
     * @returns {Promise<void>} - A promise that resolves when the user is deleted.
     */
    delete(userId : string) : Promise<void>; 

}