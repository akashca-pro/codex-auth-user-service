import { IUserRepository } from "@/domain/repository/User";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn";
import { PrismaClient, User, UserRole } from "@/generated/prisma";
import { IUserOutRequestDTO } from "@/domain/dtos/User/UserOut";
import { IUpdateUserRequestDTO } from "@/domain/dtos/User/UpdateUser";
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";
import logger from '@/utils/pinoLogger'; // Import the logger
import { IUserStats } from "@/dto/userStats.dto";

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
     * * @constructor
     * @param {PrismaClient} _prisma - The prisma client instance.
     */
    constructor(
        @inject(TYPES.PrismaClient)
        private _prisma : PrismaClient
    ){}

    /**
     * Creates a new user in the database.
     * * @async
     * @param {IUserInRequestDTO} data - The user data.
     */
    async create(data: IUserInRequestDTO): Promise<void> {
        const startTime = Date.now();
        const operation = 'create';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { email: data.email });
            await this._prisma.user.create({ data });
            logger.info(`[REPO] ${operation} successful`, { duration: Date.now() - startTime });
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, email: data.email, duration: Date.now() - startTime });
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
        const startTime = Date.now();
        const operation = 'findByEmail';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { email });
            const user = await this._prisma.user.findFirst({
                where : { email }
            })

            const found = !!user;
            logger.info(`[REPO] ${operation} successful`, { found, email, duration: Date.now() - startTime });

            if(!user) return null;

            return UserMapper.mapPrismaUserToDomain(user);

        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, email, duration: Date.now() - startTime });
            throw error;
        }

    }

    /**
     * * @param {string} email - The email address of the user.
     * @param {UserRole} role - The role of the user.
     * @returns {Promse<IUserInRequestDTO | null>} - The found user data or null if not.
     */
    async findByEmailAndRole(email: string, role: UserRole): Promise<IUserInRequestDTO | null> {
        const startTime = Date.now();
        const operation = 'findByEmailAndRole';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { email, role });
            const user = await this._prisma.user.findFirst({
                where : {
                    email,
                    role
                }
            })
            const found = !!user;
            logger.info(`[REPO] ${operation} successful`, { found, email, role, duration: Date.now() - startTime });

            if(!user) return null;

            return UserMapper.mapPrismaUserToDomain(user);

        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, email, role, duration: Date.now() - startTime });
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
        const operation = 'findById';

        try {
            logger.debug(`[REPO] Executing ${operation}`, { userId });
            const user = await this._prisma.user.findFirst({
                where : { userId }
            })
            const found = !!user;
            logger.info(`[REPO] ${operation} successful`, { found, userId, duration: Date.now() - startTime });

            if(!user) return null;

            return UserMapper.mapPrismaUserToDomain(user);
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, userId, duration: Date.now() - startTime });
            throw error;
        }

    }

    /**
     * Retrieves paginated users with filters and sorting.
     * * @param filter - Key/value filters to apply.
     * @param skip - Number of records to skip.
     * @param limit - Max number of records to return.
     * @param select - Fields to select.
     * @param sort - Sorting order, Prisma-compatible.
     * @returns Paginated list of users.
     */
    async findUsersPaginated(
    filter: Record<string, any>,
    skip: number,
    limit: number,
    sort: Record<string, "asc" | "desc"> = { createdAt: "desc" },
    select?: string[],
    ): Promise<User[]> {
        const startTime = Date.now();
        const operation = 'findUsersPaginated';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { skip, limit, filter, sort });
            const users = await this._prisma.user.findMany({
            where: filter,
            skip,
            take: limit,
            orderBy: sort,
            select: select?.reduce((acc, field) => {
                acc[field] = true
                return acc
            }, {} as Record<string, boolean>),
            })

            logger.info(`[REPO] ${operation} successful`, { count: users.length, duration: Date.now() - startTime });
            return users

        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, filter, duration: Date.now() - startTime });
            throw error
        }
    }
    
    /**
     * * @param filter - The filter query.
     * @returns The count of documents.
     */
    async countDocuments(filter: Record<string, any>): Promise<number> {
        const startTime = Date.now();
        const operation = 'countDocuments';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { filter });
            const count = await this._prisma.user.count({
                where : filter
            })
            logger.info(`[REPO] ${operation} successful`, { count, duration: Date.now() - startTime });
            return count;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, filter, duration: Date.now() - startTime });
            throw error;
        }
    }
  

    /**
     * Checks if existing user taked the username.
     * * @async
     * @param {string} username - The username of the user.
     * @return {boolean} - True if yes or false if not.
     */
    async findByUsername(username: string): Promise<boolean> {
        const startTime = Date.now();
        const operation = 'findByUsername';
        try {
            logger.debug(`[REPO] Executing ${operation}`, { username });
            const usernameExist = await this._prisma.user.findUnique({
                where : { username },
                select : { userId : true } 
            })
            const exists = !!usernameExist;
            logger.info(`[REPO] ${operation} successful`, { exists, username, duration: Date.now() - startTime });
            return exists;
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, username, duration: Date.now() - startTime });
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
    async update(userId: string, data: IUpdateUserRequestDTO): Promise<Partial<IUpdateUserRequestDTO>> {
        const startTime = Date.now();
        const operation = 'update';
        try {
            const updatedData = Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== undefined)
            )
            logger.debug(`[REPO] Executing ${operation}`, { userId, fields: Object.keys(updatedData) });
            
            const userUpdated = await this._prisma.user.update({
                where: { userId },
                data: updatedData,
                select: Object.keys(updatedData).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {} as Record<string, boolean>),
            });
            logger.info(`[REPO] ${operation} successful`, { userId, duration: Date.now() - startTime });
            return userUpdated
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, userId, duration: Date.now() - startTime });
            throw error;
        }

    }

    async getUserStats(): Promise<IUserStats> {
        const startTime = Date.now();
        const operation = 'getUserStats';

        try {
            logger.debug(`[REPO] Executing ${operation}`);

            const todayStart = new Date();
            todayStart.setUTCHours(0, 0, 0, 0);

            const [totalUsers, todaysUsers] = await Promise.all([
                this._prisma.user.count(),
                this._prisma.user.count({
                    where: {
                        createdAt: {
                            gte: todayStart,
                        },
                    },
                })
            ])

            logger.info(`[REPO] ${operation} successful`, {
                totalUsers,
                todaysUsers,
                duration: Date.now() - startTime,
            });

            return { totalUsers, todaysUsers };
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, {
                error,
                duration: Date.now() - startTime,
            });
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
        const startTime = Date.now();
        const operation = 'delete';
        try {
            logger.warn(`[REPO] Executing ${operation} (HARD DELETE)`, { userId });
            await this._prisma.user.delete({
                where : {userId},
            })
            logger.info(`[REPO] ${operation} successful`, { userId, duration: Date.now() - startTime });
        } catch (error) {
            logger.error(`[REPO] ${operation} failed`, { error, userId, duration: Date.now() - startTime });
            throw error;
        }
    }
}