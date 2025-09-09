import { inject, injectable } from "inversify";
import { IToggleBlockUserUseCase } from "../toggleBlockUser.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import TYPES from "@/config/inversify/types";
import { ToggleBlockUserDTO } from "@/domain/dtos/admin/ToggleBlockUsers.dto";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";


/**
 * Use case for toggle block user
 * 
 * @class
 * @implements {IToggleBlockUserUseCase}
 */
@injectable()
export class ToggleBlockUserUseCase implements IToggleBlockUserUseCase {
 
    #_userRepository : IUserRepository

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository
    ){
        this.#_userRepository = userRepository
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

        return {
            data : null,
            success : true
        }
    }
}