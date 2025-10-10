import { inject, injectable } from "inversify";
import { IToggleBlockUserUseCase } from "../toggleBlockUser.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import TYPES from "@/config/inversify/types";
import { ToggleBlockUserDTO } from "@/domain/dtos/admin/ToggleBlockUsers.dto";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";
import { ICacheProvider } from "@/app/providers/CacheProvider";
import { REDIS_PREFIX } from "@/config/redis/prefixKeys";
import { config } from "@/config";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Use case for toggle block user
 * * @class
 * @implements {IToggleBlockUserUseCase}
 */
@injectable()
export class ToggleBlockUserUseCase implements IToggleBlockUserUseCase {
 
    #_userRepository : IUserRepository
    #_cacheProvider : ICacheProvider

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_userRepository = userRepository,
        this.#_cacheProvider = cacheProvider
    }

    async execute(data: ToggleBlockUserDTO): Promise<ResponseDTO> {
        const { userId, block } = data;
        const operation = block ? 'BLOCK' : 'UNBLOCK';
        
        // Log 1: UseCase execution started
        logger.info(`ToggleBlockUserUseCase execution started: attempting to ${operation} user`, { userId, block });

        const user = await this.#_userRepository.findById(userId);

        if(!user){
            // Log 2A: User not found
            logger.warn('ToggleBlockUserUseCase failed: account not found', { userId, operation });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        const userEntity = User.rehydrate(user);
        
        // Check if the state is actually changing to avoid unnecessary database and cache writes
        if (userEntity.isBlocked === data.block) {
            logger.info(`ToggleBlockUserUseCase completed: user is already ${block ? 'BLOCKED' : 'UNBLOCKED'}`, { userId, block });
            return { data: null, success: true, message: `User is already ${block ? 'blocked' : 'unblocked'}` };
        }

        userEntity.update({
            isBlocked : block
        });

        await this.#_userRepository.update(user.userId, userEntity.getUpdatedFields());
        // Log 3: Database update successful
        logger.info(`User database updated: isBlocked set to ${block}`, { userId });

        const cacheKey = `${REDIS_PREFIX.USER_BLOCKED}:${user.userId}`
        const profileCacheKey = `${REDIS_PREFIX.USER_PROFILE}${user.userId}`

        if(userEntity.isBlocked){
            await this.#_cacheProvider.set(cacheKey, 1, config.BLOCKED_USER_CACHE_EXPIRY);
            await this.#_cacheProvider.del(profileCacheKey);
            // Log 4A: Caching operations for BLOCK
            logger.info('Cache updated for BLOCK operation', { 
                userId, 
                blockedCacheSet: true, 
                profileCacheDeleted: true 
            });
        }else{
            await this.#_cacheProvider.del(cacheKey);
            // Log 4B: Caching operations for UNBLOCK
            logger.info('Cache updated for UNBLOCK operation', { 
                userId, 
                blockedCacheDeleted: true 
            });
        }
        
        // Log 5: UseCase execution completed successfully
        logger.info(`ToggleBlockUserUseCase completed successfully: User ${operation}ED`, { userId });
        
        return {
            data : null,
            success : true,
            message: `User successfully ${operation.toLowerCase()}ED`
        }
    }
}