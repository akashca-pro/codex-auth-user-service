import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IUserRepository } from "@/domain/repository/User";
import { IUserStats } from "@/dto/userStats.dto";
import logger from "@/utils/logger";
import { inject, injectable } from "inversify";


@injectable()
export class UserStatsUseCase {

    #_userRepository : IUserRepository

    constructor(
        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository
    ){
        this.#_userRepository = userRepository
    }

    async execute(): Promise<ResponseDTO> {
        logger.info('UserStatsUseCase execution started');

        const stats = await this.#_userRepository.getUserStats();

        logger.info('UserStatsUseCase execution completed successfully', { stats });

        return {
            data : stats,
            success : true,
            message : 'User stats fetched successfully'
        }
    }
}