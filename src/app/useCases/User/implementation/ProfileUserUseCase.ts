import { ResponseDTO } from "@/domain/dtos/Response";
import { IProfileUseCase } from "../ProfileUserUseCase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { ICacheProvider } from "@/app/providers/CacheProvider";
import { config } from "@/config";
import { REDIS_PREFIX } from "@/config/redis/prefixKeys";


/**
 * Use case for retrieving profile of a user.
 * 
 * @class
 * @implements {IProfileUserUseCase}
 */
@injectable()
export class ProfileUseCase implements IProfileUseCase {

    #_userRepository : IUserRepository
    #_cacheProvider : ICacheProvider
    

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_userRepository = userRepository;
        this.#_cacheProvider = cacheProvider
    }

    /**
     * 
     * @async
     * @param {string} userId - The id of the user. 
     * @return {ResponseDTO} - The response data.
     */
    async execute(userId: string): Promise<ResponseDTO> {

        const cacheKey = `${REDIS_PREFIX.USER_PROFILE}${userId}`;

        const cached = await this.#_cacheProvider.get(cacheKey);
        if(cached){
            return {
                data : cached,
                success : true,
                message : UserSuccessType.ProfileLoaded
            }
        }
        
        const user = await this.#_userRepository.findById(userId);

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
                
        const response = UserMapper.toOutDTO(user);
        await this.#_cacheProvider.set(cacheKey, response, config.PROFILE_CACHE_EXPIRY);
        
        return { 
            data : response,
            success : true,
            message : UserSuccessType.ProfileLoaded
        }
    }
}
