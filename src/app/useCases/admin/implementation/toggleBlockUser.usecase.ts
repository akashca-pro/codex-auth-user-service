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


/**
 * Use case for toggle block user
 * 
 * @class
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

        const user = await this.#_userRepository.findById(data.userId);

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        const userEntity = User.rehydrate(user);
        userEntity.update({
            isBlocked : data.block
        })

        await this.#_userRepository.update(user.userId, userEntity.getUpdatedFields());

        const cacheKey = `${REDIS_PREFIX.USER_BLOCKED}:${user.userId}`
        const profileCacheKey = `${REDIS_PREFIX.USER_PROFILE}${user.userId}`

        if(userEntity.isBlocked){
            await this.#_cacheProvider.set(cacheKey, 1, config.BLOCKED_USER_CACHE_EXPIRY);
            await this.#_cacheProvider.del(profileCacheKey)
        }else{
            await this.#_cacheProvider.del(cacheKey);
        }
        
        return {
            data : null,
            success : true
        }
    }
}