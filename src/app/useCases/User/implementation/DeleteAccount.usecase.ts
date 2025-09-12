import { inject, injectable } from "inversify";
import { IDeleteAccountUseCase } from "../DeleteAccount.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";


/**
 * Class representing the implementation of the change email use case.
 * 
 * @class
 * @implements {IDeleteAccountUseCase}
 */
@injectable()
export class DeleteAccountUseCase implements IDeleteAccountUseCase {

    #_userRepository : IUserRepository
    #_passwordHasher : IPasswordHasher

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.IPasswordHasher) passwordHasher : IPasswordHasher
    ){
        this.#_userRepository = userRepository
        this.#_passwordHasher = passwordHasher
    }

    async execute(
        userId: string,
        password: string
    ): Promise<ResponseDTO> {
        
        const user = await this.#_userRepository.findById(userId)

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        
        if(!await this.#_passwordHasher.comparePasswords(password, user.password!)){
            return {
                data : null,
                message : AuthenticateUserErrorType.IncorrectPassword,
                success : false
            }
        }

        const userEntity = User.rehydrate(user);
        userEntity.update({ isArchived : true });

        await this.#_userRepository.update(userId, userEntity.getUpdatedFields());

        return {
            data : null,
            success : true
        }
    }
}
