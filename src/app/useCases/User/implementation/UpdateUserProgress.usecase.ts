import { inject, injectable } from "inversify";
import { IUpdateUserProgressUsecase } from "../UpdateUserProgress.usecase.interface";
import TYPES from "@/config/inversify/types";
import { IUserRepository } from "@/domain/repository/User";
import { ResponseDTO } from "@/domain/dtos/Response";
import { UpdateUserProgressRequest } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger';
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";

@injectable()
export class UpdateUserProgressUseCase implements IUpdateUserProgressUsecase {

    #_userRepo : IUserRepository

    constructor(
        @inject(TYPES.IUserRepository) userRepo : IUserRepository
    ){
        this.#_userRepo = userRepo
    }

    async execute(
        req: UpdateUserProgressRequest
    ): Promise<ResponseDTO> {
        const userId = req.userId;

        // Log 1: Execution start
        logger.info('UpdateUserProgressUseCase execution started', { userId: req.userId })
        const user = await this.#_userRepo.findById(userId);

        if(!user){
            // Log 2A: User not found
            logger.warn('Profile update failed: account not found', { userId });
            return {
                data : null,
                success : false,
                message : AuthenticateUserErrorType.AccountNotFound
            }
        }

        logger.debug('User found. Applying updates to progress data');

        const userEntity = User.rehydrate(user);

        if (req.isSubmitted && req.difficulty) {
            logger.debug('Applying progress updates', { userId, difficulty: req.difficulty });

            if (req.difficulty === 'easy') {
                const newCount = (user.easySolved ? user.easySolved + 1 : 1);
                userEntity.update({ easySolved: newCount });
                logger.debug('Incremented easySolved count', { userId, newCount });
            } else if (req.difficulty === 'medium') {
                const newCount = (user.mediumSolved ? user.mediumSolved + 1 : 1);
                userEntity.update({ mediumSolved: newCount });
                logger.debug('Incremented mediumSolved count', { userId, newCount });
            } else if (req.difficulty === 'hard') {
                const newCount = (user.hardSolved ? user.hardSolved + 1 : 1);
                userEntity.update({ hardSolved: newCount });
                logger.debug('Incremented hardSolved count', { userId, newCount });
            }

            const newSubmissionCount = (user.totalSubmission ? user.totalSubmission + 1 : 1);
            userEntity.update({ totalSubmission: newSubmissionCount });
            logger.debug('Incremented totalSubmission count', { userId, newSubmissionCount });
        } else {
            logger.debug('No submission or difficulty provided, skipping progress update', { userId });
        }

        const fieldsToUpdate = userEntity.getUpdatedFields();
        logger.debug('Fields prepared for update', { userId, fieldsToUpdate });
        await this.#_userRepo.update(userId, fieldsToUpdate);
        logger.info('User progress successfully updated', { userId, fieldsToUpdate });

        return {
            data : null,
            success : true
        }
    }

}