import { inject, injectable } from "inversify";
import { IDeleteAccountUseCase } from "../DeleteAccount.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";
import { DeleteAccountRequest } from "@akashcapro/codex-shared-utils";
import { IDeleteAccountRequestDTO } from "@/domain/dtos/User/DeleteAccount.dto";
import logger from '@/utils/pinoLogger'; 
import grpcSubmissionClient from "@/infra/gRPC/SubmissionServices";

/**
 * Class representing the implementation of the change email use case.
 * * @class
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
        request : DeleteAccountRequest
    ): Promise<ResponseDTO> {
        const dto : IDeleteAccountRequestDTO = {
            userId : request.userId,
            password : request.password
        }

        // Log 1: Execution start
        logger.info('DeleteAccountUseCase execution started (Account Archival)', { userId: dto.userId });

        const user = await this.#_userRepository.findById(dto.userId)

        if(!user){
            // Log 2A: User not found
            logger.warn('Account deletion failed: account not found', { userId: dto.userId });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        
        // Log 2B: Verifying password
        if(!user.password || !await this.#_passwordHasher.comparePasswords(dto.password, user.password)){
            // Log 2C: Incorrect password
            logger.warn('Account deletion failed: incorrect password provided', { userId: dto.userId });
            return {
                data : null,
                message : AuthenticateUserErrorType.IncorrectPassword,
                success : false
            }
        }

        // Log 3: Password verified, proceeding to archive
        logger.info('Password verified. Archiving user account (soft delete)', { userId: dto.userId });

        try {
            logger.info('Removing user from the leaderboard, gRPC call to submission service');
            await grpcSubmissionClient.removeUserInLeaderboard({userId : user.userId})
            logger.info('User removed from the leaderboard')
        } catch (error) {
            // publish the update to kafka.
            logger.error('User not removed from the leaderboard',error)
        }

        const userEntity = User.rehydrate(user);
        userEntity.update({ isArchived : true });

        await this.#_userRepository.update(dto.userId, userEntity.getUpdatedFields());

        // Log 4: Execution successful
        logger.info('DeleteAccountUseCase completed successfully: User account archived', { userId: dto.userId });

        return {
            data : null,
            success : true
        }
    }
}