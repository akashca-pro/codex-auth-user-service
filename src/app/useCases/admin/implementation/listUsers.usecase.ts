import { inject, injectable } from "inversify";
import { IListUsersUseCase } from "../listUsers.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import TYPES from "@/config/inversify/types";
import { IListUsersDTO } from "@/domain/dtos/admin/ListUsers.dto";
import { PaginationDTO } from "@/domain/dtos/Pagination";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import logger from '@/utils/pinoLogger';

/**
 * Use case for listing users.
 * * @class
 * @implements {IListUsersUseCase}
 */
@injectable() // Corrected: Moved injectable decorator to before the class definition
export class ListUsersUseCase implements IListUsersUseCase {

    #_userRepository : IUserRepository

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository
    ){
        this.#_userRepository = userRepository
    }

    async execute(
        filters: IListUsersDTO
    ): Promise<PaginationDTO> {
        // Log 1: UseCase execution started
        logger.info('ListUsersUseCase execution started', { initialFilters: filters });

        const where: Record<string, any> = {}
        where.role = 'USER'

        if (filters.authProvider) {
            where.authProvider = UserMapper.toValidAuthProvider(filters.authProvider)
        }

        if (filters.search) {
            where.OR = [
                { username: { startsWith: filters.search, mode: "insensitive" } },
                { firstName: { startsWith: filters.search, mode: "insensitive" } },
                { lastName: { startsWith: filters.search, mode: "insensitive" } },
                { country: { startsWith: filters.search, mode: "insensitive" } },
                { email: { startsWith: filters.search, mode: "insensitive" } },
            ]
        }

        if (filters.isArchived !== null && filters.isArchived !== undefined) { // Added undefined check for robustness
            where.isArchived = filters.isArchived
        }

        if (filters.isVerified !== null && filters.isVerified !== undefined) { // Added undefined check for robustness
            where.isVerified = filters.isVerified
        }

        if(filters.isBlocked !== null && filters.isBlocked !== undefined) { // Added undefined check for robustness
            where.isBlocked = filters.isBlocked
        }

        const orderBy: Record<string, "asc" | "desc"> = {
            createdAt: filters.sort === "oldest" ? "asc" : "desc",
        }

        const skip = (filters.page - 1) * filters.limit
        const select = [
            "userId",
            "username",
            "email",
            "firstName",
            "lastName",
            "avatar",
            "country",
            "authProvider",
            "isVerified",
            "preferredLanguage",
            "isArchived",
            "isBlocked",
            "easySolved",
            "mediumSolved",
            "hardSolved",
            "totalSubmission",
            "streak",
            "createdAt",
            "updatedAt",
        ]
        
        // Log 2: Final filters before repository call
        logger.debug('ListUsersUseCase executing repository calls', { 
            where, 
            orderBy, 
            skip, 
            limit: filters.limit 
        });

        const [totalItems, users] = await Promise.all([
            await this.#_userRepository.countDocuments(where),
            await this.#_userRepository.findUsersPaginated(
                where,
                skip,
                filters.limit,
                orderBy,
                select
            )
        ]);

        const totalPages = Math.ceil(totalItems/ filters.limit);

        // Log 3: UseCase execution completed successfully
        logger.info('ListUsersUseCase execution completed successfully', {
            currentPage: filters.page,
            totalItems,
            totalPages,
            usersCount: users.length
        });

        return {
            body : users || [],
            currentPage : filters.page,
            totalItems,
            totalPages
        }
    }
}