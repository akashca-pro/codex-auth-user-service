import { inject, injectable } from "inversify";
import { IChangePassUseCase } from "../ChangePass.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IChangePassRequestDTO } from "@/domain/dtos/User/ChangePass.dto";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { User } from "@/domain/entities/User";
import { ChangePasswordRequest } from "@akashcapro/codex-shared-utils";

/**
 * Class representing the implementation of the change password use case.
 * 
 * @class
 * @implements {IChangePassUseCase}
 */
@injectable()
export class ChangePassUseCase implements IChangePassUseCase {

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
        request : ChangePasswordRequest
    ): Promise<ResponseDTO> {
        const dto : IChangePassRequestDTO = {
            currPass : request.currPass,
            newPass : request.newPass
        }
        const user = await this.#_userRepository.findById(request.userId)

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        if(!await this.#_passwordHasher.comparePasswords(dto.currPass, user.password!)){
            return {
                data : null,
                message : AuthenticateUserErrorType.IncorrectPassword,
                success : false
            }
        }
        const hashedNewPass = await this.#_passwordHasher.hashPassword(dto.newPass);
        const userEntity = User.rehydrate(user);
        userEntity.update({ password : hashedNewPass });
        await this.#_userRepository.update(request.userId, userEntity.getUpdatedFields());
        return {
           data : null,
           success : true     
        }
    }
}