import { PaginationDTO } from "@/domain/dtos/Pagination";
import { ICreateUserRequestDTO } from "@/domain/dtos/User/CreateUser";
import { IUpdateUserRequestDTO } from "@/domain/dtos/User/UpdateUser";
import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn";

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
     * @param {IUserInRequestDTO} data - The user data that is created.
     * @returns {Promise<IUserInRequestDTO>} - The created user data.
     */
    create(data : IUserInRequestDTO) : Promise<IUserInRequestDTO>;

    /**
     * Find a user by their email address and role.
     * 
     * @async
     * @param {string} email - The email address of the user.
     * @returns {Promse<IUserInRequestDTO | null>} - The found user data or undefined if not.
     */
    findByEmail(email : string) : Promise<IUserInRequestDTO | null>;

    /**
     * Find a user by their userId and role.
     * 
     * @async
     * @param {string} userId - The id of the user.
     * @returns { Promise<IUserInRequestDTO | null> } - The found user data or undefined if not.
     */
    findById(userId : string) : Promise<IUserInRequestDTO | null>;

    /**
     * Find a user by their userId and role.
     * 
     * @async
     * @param {string} username - The username of the user.
     * @returns { Promise<IUserInRequestDTO | null> } - The found user data or undefined if not.
     */
    findByUsername(username : string) : Promise<IUserInRequestDTO | null>;

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
     * @param {IUserInRequestDTO} user - The user to be updated.
     * @param {IUpdateUserRequestDTO} data - The updated user data.
     * @returns {Promise<IUserInRequestDTO>} - The updated user data.
     */
    update(
        user : IUserInRequestDTO, 
        data : IUpdateUserRequestDTO,
    ) : Promise<IUserInRequestDTO>;

    /**
     * Delete a user by their id
     * 
     * @async
     * @param {string} userId - The id of the user to be deleted.
     * @returns {Promise<void>} - A promise that resolves when the user is deleted.
     */
    delete(userId : string) : Promise<void>; 

}