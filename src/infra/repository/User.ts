import { IUserRepository } from "@/app/repository/User";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { PaginationDTO } from "@/domain/dtos/Pagination";
import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn";
import { PrismaClient } from "@/generated/prisma";
import { userSelectFields } from "./prisma/userSelect";
import { IUserOutRequestDTO } from "@/domain/dtos/User/UserOut";
import { IUpdateUserRequestDTO } from "@/domain/dtos/User/UpdateUser";

/**
 * Prisma implementation of the user repository.
 *
 * @class
 * @implements {IUsersRepository}
 */
export class UserRepository implements IUserRepository {
    /**
     * Creates an instance of UserRepository.
     * 
     * @constructor
     * @param {PrismaClient} prisma - The prisma client instance.
     */
    constructor(
        private prisma : PrismaClient
    ){}

    /**
     * Creates a new user in the database.
     * 
     * @async
     * @param {IUserInRequestDTO} data - The user data.
     */
    async create(data: IUserInRequestDTO): Promise<void> {

       await this.prisma.user.create({ data });

    }

    /**
     * Finds a user by email.
     *
     * @async
     * @param {string} email - The email to search for.
     * @returns {Promise<IUserInRequestDTO | null>} The found user or null.
     */
    async findByEmail(email: string): Promise<IUserInRequestDTO | null> {
        
        const user = await this.prisma.user.findFirst({
            where : { email }
        })

        if(!user) return null;

        return UserMapper.mapPrismaUserToDomain(user);

    }

    /**
     * Finds a user by ID.
     *
     * @async
     * @param {string} userId - The ID of the user to find.
     * @returns {Promise<IUserInRequestDTO | null>} The found user or null.
     */
    async findById(userId: string): Promise<IUserInRequestDTO | null> {
        
        const user = await this.prisma.user.findFirst({
            where : { userId }
        })

        if(!user) return null;

        return UserMapper.mapPrismaUserToDomain(user);

    }

    /**
     * Retrieves a paginated list of users.
     *
     * @async
     * @param {number} pageNumber - The page number to retrieve.
     * @returns {Promise<PaginationDTO>} The paginated list of users.
     */
    async findAll(pageNumber: number): Promise<PaginationDTO | null> {
        
        const perPage = 4;
        const users : IUserOutRequestDTO[] = await this.prisma.user.findMany({
            take : perPage,
            skip : Math.ceil((pageNumber - 1) * perPage),
            orderBy : {
                username : 'asc',
            },
            select : {
                ...userSelectFields
            }
        });

        const total = await this.prisma.user.count();

        return {
            body : users,
            total,
            page : pageNumber,
            lastPage : Math.ceil((total / perPage))
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
        
        const usernameExist = await this.prisma.user.findUnique({
            where : { username },
            select : { userId : true } 
        })

        return !!usernameExist

    }

    /**
     * Updates a user with new data.
     *
     * @async
     * @param {string} user - The user to update.
     * @param {IUpdateUserRequestDTO} data - The updated user data.
     * @returns {Promise<IUserOutRequestDTO>} The updated user.
     */
    async update(userId: string, data: IUpdateUserRequestDTO): Promise<IUserOutRequestDTO> {
        
        const userUpdated = await this.prisma.user.update({
            where : {userId},
            data : {
                username : data.username,
                email : data.email,
                firstName : data.firstName,
                lastName : data.lastName,
                avatar : data.avatar,
                country : data.country,
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
    }

    /**
     * Deletes a user by ID.
     *
     * @async
     * @param {string} userId - The ID of the user to delete.
     * @returns {Promise<void>} A Promise that resolves once the user is deleted.
     */
    async delete(userId: string): Promise<void> {
        await this.prisma.user.delete({
            where : {userId},
        })
    }

}