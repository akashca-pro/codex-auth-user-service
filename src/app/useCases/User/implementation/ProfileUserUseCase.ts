import { ResponseDTO } from "@/domain/dtos/Response";
import { IProfileUserUseCase } from "../ProfileUserUseCase";
import { IUserRepository } from "@/app/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";

/**
 * Use case for retrieving profile of a user.
 * 
 * @class
 * @implements {IProfileUserUseCase}
 */
export class ProfileUserUseCase implements IProfileUserUseCase {

    /**
     * Creates an instance of ProfileUserUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     */
    constructor(
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

            return { 
                data : response , success : true
            }
            
        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }

    }

}
