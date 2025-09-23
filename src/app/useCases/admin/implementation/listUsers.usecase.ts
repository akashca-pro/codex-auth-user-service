import { inject, injectable } from "inversify";
import { IListUsersUseCase } from "../listUsers.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import TYPES from "@/config/inversify/types";
import { IListUsersDTO } from "@/domain/dtos/admin/ListUsers.dto";
import { PaginationDTO } from "@/domain/dtos/Pagination";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";


/**
 * Use case for listing users.
 * 
 * @class
 * @implements {IListUsersUseCase}
 */
injectable()
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

        if (filters.isArchived !== null) {
            where.isArchived = filters.isArchived
        }

        if (filters.isVerified !== null) {
            where.isVerified = filters.isVerified
        }

        if(filters.isBlocked !== null) {
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

        return {
            body : users || [],
            currentPage : filters.page,
            totalItems,
            totalPages
        }
    }
}
