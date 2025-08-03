import { inject, injectable } from "inversify";
import { IUpdateUserProfileUseCase } from "../UpdateProfileUseCase";
import { IUserRepository } from "@/domain/repository/User";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IUpdateUserProfileRequestDTO } from "@/domain/dtos/User/UpdateUserProfile";
import TYPES from "@/config/inversify/types";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";

/**
 * Implementation of the update user profile use case.
 * 
 * @class
 * @implements {IUpdateUserProfileUseCase}
 */
@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    
    #_userRepository : IUserRepository

    /**
     * 
     * @param userRepository - user repository.
     * @constructor
     */
    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository
    ){
        this.#_userRepository = userRepository;
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

        return {
            data : null,
            message : UserSuccessType.ProfileUpdated,
            success : true
        }
    }
}
