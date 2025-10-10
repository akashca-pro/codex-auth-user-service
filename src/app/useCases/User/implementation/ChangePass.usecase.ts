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
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Class representing the implementation of the change password use case.
 * * @class
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
        const userId = request.userId;

        // Log 1: Execution start
        logger.info('ChangePassUseCase execution started', { userId });
        
        const user = await this.#_userRepository.findById(userId)

        if(!user){
            // Log 2A: User not found
            logger.warn('Change password failed: account not found', { userId });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        
        // Log 2B: Verifying current password
        if(!user.password || !await this.#_passwordHasher.comparePasswords(dto.currPass, user.password)){
            // Log 2C: Incorrect password
            logger.warn('Change password failed: incorrect current password', { userId });
            return {
                data : null,
                message : AuthenticateUserErrorType.IncorrectPassword,
                success : false
            }
        }

        // Log 3: Password verified, proceeding to hash and update
        logger.info('Current password verified. Hashing new password and updating user', { userId });

        const hashedNewPass = await this.#_passwordHasher.hashPassword(dto.newPass);
        
        const userEntity = User.rehydrate(user);
        userEntity.update({ password : hashedNewPass });
        
        await this.#_userRepository.update(userId, userEntity.getUpdatedFields());

        // Log 4: Execution successful
        logger.info('ChangePassUseCase completed successfully: password changed', { userId });
        
        return {
           data : null,
           success : true     
        }
    }
}