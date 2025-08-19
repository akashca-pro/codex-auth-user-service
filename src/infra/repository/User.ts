import { IUserRepository } from "@/domain/repository/User";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { PaginationDTO } from "@/domain/dtos/Pagination";
import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn";
import { PrismaClient, UserRole } from "@/generated/prisma";
import { IUserOutRequestDTO } from "@/domain/dtos/User/UserOut";
import { IUpdateUserRequestDTO } from "@/domain/dtos/User/UpdateUser";
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";


/**
 * Prisma implementation of the user repository.
 *
 * @class
 * @implements {IUsersRepository}
 */
@injectable()
export class UserRepository implements IUserRepository {
    /**
     * Creates an instance of UserRepository.
     * 
     * @constructor
     * @param {PrismaClient} _prisma - The prisma client instance.
     */
    constructor(
        @inject(TYPES.PrismaClient)
        private _prisma : PrismaClient
    ){}

    /**
     * Creates a new user in the database.
     * 
     * @async
     * @param {IUserInRequestDTO} data - The user data.
     */
    async create(data: IUserInRequestDTO): Promise<void> {
        try {
            await this._prisma.user.create({ data });

        } catch (error) {
            throw error;
        }

    }

    /**
     * Finds a user by email.
     *
     * @async
     * @param {string} email - The email to search for.
     * @returns {Promise<IUserInRequestDTO | null>} The found user or null.
     */
    async findByEmail(email: string): Promise<IUserInRequestDTO | null> {
        try {
            const user = await this._prisma.user.findFirst({
                where : { email }
            })

            if(!user) return null;

            return UserMapper.mapPrismaUserToDomain(user);

        } catch (error) {
            throw error;
        }

    }

    /**
     * 
     * @param {string} email - The email address of the user.
     * @param {UserRole} role - The role of the user.
     * @returns {Promse<IUserInRequestDTO | null>} - The found user data or null if not.
     */
    async findByEmailAndRole(email: string, role: UserRole): Promise<IUserInRequestDTO | null> {
        try {
            const user = await this._prisma.user.findFirst({
                where : {
                    email,
                    role
                }
            })
            if(!user) return null;

            return UserMapper.mapPrismaUserToDomain(user);

        } catch (error) {
            throw error;
        }

    }

    /**
     * Finds a user by ID.
     *
     * @async
     * @param {string} userId - The ID of the user to find.
     * @returns {Promise<IUserInRequestDTO | null>} The found user or null.
     */
    async findById(userId: string): Promise<IUserInRequestDTO | null> {
        const startTime = Date.now();
        const operation = 'find_by_id';

        try {
            const user = await this._prisma.user.findFirst({
                where : { userId }
            })
            if(!user) return null;

            return UserMapper.mapPrismaUserToDomain(user);
        } catch (error) {
            throw error;
        }

    }

    /**
     * Retrieves a paginated list of users.
     *
     * @async
     * @param {number} pageNumber - The page number to retrieve.
     * @returns {Promise<PaginationDTO>} The paginated list of users.
     */
    async findAll(pageNumber: number): Promise<PaginationDTO | null> {

        const startTime = Date.now();
        const operation = 'find_all';
        
        try {
            const perPage = 4;
            const users : IUserOutRequestDTO[] = await this._prisma.user.findMany({
                take : perPage,
                skip : Math.ceil((pageNumber - 1) * perPage),
                orderBy : {
                    username : 'asc',
                },
                select : {
                    userId: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    country: true,
                    preferredLanguage: true,
                    easySolved: true,
                    mediumSolved: true,
                    hardSolved: true,
                    totalSubmission: true,
                    streak: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            const total = await this._prisma.user.count();
            return {
                body : users,
                total,
                page : pageNumber,
                lastPage : Math.ceil((total / perPage))
            } 
        } catch (error) {
            throw error;
        }
    }

    /**
     * Checks if existing user taked the username.
     * 
     * @async
     * @param {string} username - The username of the user.
     * @return {boolean} - True if yes or false if not.
     */
    async findByUsername(username: string): Promise<boolean> {
        try {
            const usernameExist = await this._prisma.user.findUnique({
                where : { username },
                select : { userId : true } 
            })
            return !!usernameExist
        } catch (error) {
            throw error;
        }

    }

    /**
     * Updates a user with new data.
     *
     * @async
     * @param {string} userId - The user to update.
     * @param {IUpdateUserRequestDTO} data - The updated user data.
     * @returns {Promise<IUserOutRequestDTO>} The updated user.
     */
    async update(userId: string, data: IUpdateUserRequestDTO): Promise<IUserOutRequestDTO> {
        try {
            const userUpdated = await this._prisma.user.update({
                where : {userId},
                data : {
                    username : data.username,
                    email : data.email,
                    firstName : data.firstName,
                    lastName : data.lastName,
                    avatar : data.avatar,
                    country : data.country,
                    password : data.password,
                    isVerified : data.isVerified,
                    isArchived : data.isArchived,
                    preferredLanguage : data.preferredLanguage,
                    easySolved : data.easySolved,
                    mediumSolved : data.mediumSolved,
                    hardSolved : data.hardSolved,
                    totalSubmission : data.totalSubmission,
                    streak : data.streak,
                    updatedAt : data.updatedAt
                }
            })
            return userUpdated
        } catch (error) {
            throw error;
        }

    }

    /**
     * Deletes a user by ID.
     *
     * @async
     * @param {string} userId - The ID of the user to delete.
     * @returns {Promise<void>} A Promise that resolves once the user is deleted.
     */
    async delete(userId: string): Promise<void> {
        try {
            await this._prisma.user.delete({
                where : {userId},
            })
        } catch (error) {
            throw error;
        }
    }
}