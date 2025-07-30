import { PaginationDTO } from "@/domain/dtos/Pagination";
import { IUpdateUserRequestDTO } from "@/domain/dtos/User/UpdateUser";
import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn";
import { IUserOutRequestDTO } from "@/domain/dtos/User/UserOut";
import { UserRole } from "@/generated/prisma";

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
     */
    create(data : IUserInRequestDTO) : Promise<void>;

    /**
     * Find a user by their email address.
     * 
     * @async
     * @param {string} email - The email address of the user.
     * @returns {Promse<IUserInRequestDTO | null>} - The found user data or null if not.
     */
    findByEmail(email : string) : Promise<IUserInRequestDTO | null>;

    /**
     * 
     * @param {string} email - The email address of the user.
     * @param {UserRole} role - The role of the user.
     * @returns {Promse<IUserInRequestDTO | null>} - The found user data or null if not.
     */
    findByEmailAndRole(email : string, role : UserRole) : Promise<IUserInRequestDTO | null> 

    /**
     * Find a user by their userId.
     * 
     * @async
     * @param {string} userId - The id of the user.
     * @returns { Promise<IUserInRequestDTO | null> } - The found user data or undefined if not.
     */
    findById(userId : string) : Promise<IUserInRequestDTO | null>;

    /**
     * Find if any existing user taken provided username.
     * 
     * @async
     * @param {string} username - The username of the user.
     * @returns { Promise<boolean> } - True if yes or false if not.
     */
    findByUsername(username : string) : Promise<boolean>;

    /**
     * Retrieves a paginated list of all users.
     * 
     * @async
     * @param {number} pageNumber - The page number for pagination.
     * @returns {Promise<PaginationDTO>} - The paginated list of users.
     */
    findAll(pageNumber : number) : Promise<PaginationDTO | null>;


    /**
     * Updated the user data with the provided information.
     * 
     * @async
     * @param {string} userId - The id of the user.
     * @param {IUpdateUserRequestDTO} data - The updated user data.
     * @returns {Promise<IUserInRequestDTO>} - The updated user data.
     */
    update(
        userId : string, 
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