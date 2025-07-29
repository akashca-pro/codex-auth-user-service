import { ResponseDTO } from "@/domain/dtos/Response";
import { IProfileUseCase } from "../ProfileUserUseCase";
import { IUserRepository } from "@/app/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";

/**
 * Use case for retrieving profile of a user.
 * 
 * @class
 * @implements {IProfileUserUseCase}
 */
@injectable()
export class ProfileUseCase implements IProfileUseCase {

    /**
     * Creates an instance of ProfileUserUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     */
    constructor(
        @inject(TYPES.IUserRepository)
        private userRepository : IUserRepository
    ){}

    /**
     * 
     * @async
     * @param {string} userId - The id of the user. 
     * @return {ResponseDTO} - The response data.
     */
    async execute(userId: string): Promise<ResponseDTO> {
        
        try {

            const user = await this.userRepository.findById(userId);

            if(!user){
                return {data : { message : AuthenticateUserErrorType.AccountNotFound }, success : false}
            }

            const response = UserMapper.toOutDTO(user);
            console.log(response)

            return { 
                data : response , success : true
            }
            
        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }

    }

}
