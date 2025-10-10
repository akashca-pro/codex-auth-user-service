import { inject, injectable } from "inversify";
import { IUpdateUserProfileUseCase } from "../UpdateProfileUseCase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IUpdateUserProfileRequestDTO } from "@/domain/dtos/User/UpdateUserProfile";
import TYPES from "@/config/inversify/types";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { ICacheProvider } from "@/app/providers/CacheProvider";
import { REDIS_PREFIX } from "@/config/redis/prefixKeys";
import { UpdateProfileRequest } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Implementation of the update user profile use case.
 * * @class
 * @implements {IUpdateUserProfileUseCase}
 */
@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    
    #_userRepository : IUserRepository
    #_cacheProvider : ICacheProvider

    /**
     * * @param userRepository - user repository.
     * @constructor
     */
    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_userRepository = userRepository;
        this.#_cacheProvider = cacheProvider
    }

    execute = async (
        request : UpdateProfileRequest
    ): Promise<ResponseDTO> => {
        const updatedData : IUpdateUserProfileRequestDTO = {
            username :request.username,
            firstName : request.firstName,
            lastName : request.lastName,
            avatar : request.avatar,
            country : request.country,
            preferredLanguage : request.preferredLanguage
        }
        const userId = request.userId;

        // Log 1: Execution start
        logger.info('UpdateUserProfileUseCase execution started', { userId });

        const user = await this.#_userRepository.findById(userId);

        if(!user){
            // Log 2A: User not found
            logger.warn('Profile update failed: account not found', { userId });
            return {
                data : null,
                success : false,
                message : AuthenticateUserErrorType.AccountNotFound
            }
        }

        // Log 3: Updating user entity and repository
        logger.debug('User found. Applying updates to profile data.', { userId, updates: Object.keys(updatedData).filter(key => updatedData[key as keyof IUpdateUserProfileRequestDTO] !== undefined) });

        const userEntity = User.rehydrate(user);
        userEntity.update(updatedData);
        const fieldsToUpdate = userEntity.getUpdatedFields();

        await this.#_userRepository.update(userId, fieldsToUpdate);

        const cacheKey = `${REDIS_PREFIX.USER_PROFILE}${userId}`;
        
        // Log 4: Cache invalidation
        logger.info('Profile successfully updated in database. Invalidating profile cache key.', { userId, cacheKey });
        await this.#_cacheProvider.del(cacheKey);

        // Log 5: Execution successful
        logger.info('UpdateUserProfileUseCase completed successfully', { userId });

        return {
            data : null,
            message : UserSuccessType.ProfileUpdated,
            success : true
        }
    }
}