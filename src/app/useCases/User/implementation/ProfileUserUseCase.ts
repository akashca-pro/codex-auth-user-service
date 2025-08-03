import { ResponseDTO } from "@/domain/dtos/Response";
import { IProfileUseCase } from "../ProfileUserUseCase";
import { IUserRepository } from "@/domain/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { IUserOutRequestDTO } from "@/domain/dtos/User/UserOut";

/**
 * Use case for retrieving profile of a user.
 * 
 * @class
 * @implements {IProfileUserUseCase}
 */
@injectable()
export class ProfileUseCase implements IProfileUseCase {

    #_userRepository : IUserRepository

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository
    ){
        this.#_userRepository = userRepository;
    }

    /**
     * 
     * @async
     * @param {string} userId - The id of the user. 
     * @return {ResponseDTO} - The response data.
     */
    async execute(userId: string): Promise<ResponseDTO> {

        const user = await this.#_userRepository.findById(userId);
        console.log(user);

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        const response = UserMapper.toOutDTO(user);

        return { 
            data : response,
            success : true,
            message : UserSuccessType.ProfileLoaded
        }
    }
}
