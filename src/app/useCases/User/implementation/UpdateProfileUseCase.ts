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

/**
 * Implementation of the update user profile use case.
 * 
 * @class
 * @implements {IUpdateUserProfileUseCase}
 */
@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    
    #_userRepository : IUserRepository
    #_cacheProvider : ICacheProvider

    /**
     * 
     * @param userRepository - user repository.
     * @constructor
     */
    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_userRepository = userRepository;
        this.#_cacheProvider = cacheProvider
    }

    execute = async (userId : string, updatedData: IUpdateUserProfileRequestDTO): Promise<ResponseDTO> => {
                    
        const user = await this.#_userRepository.findById(userId);

        if(!user){
            return {
                data : null,
                success : false,
                message : AuthenticateUserErrorType.AccountNotFound
            }
        }

        const userEntity = User.rehydrate(user);
        userEntity.update(updatedData);

        await this.#_userRepository.update(userId, userEntity.getUpdatedFields());

        const cacheKey = `${REDIS_PREFIX.USER_PROFILE}${userId}`;
        await this.#_cacheProvider.del(cacheKey);

        return {
            data : null,
            message : UserSuccessType.ProfileUpdated,
            success : true
        }
    }
}
