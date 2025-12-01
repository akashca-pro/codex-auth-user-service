import { inject, injectable } from "inversify";
import { IVerifyNewEmailUseCase } from "../VerifyNewEmail.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IVerifyNewEmailRequestDTO } from "@/domain/dtos/User/VerifyNewEmail.dto";
import { OtpType } from "@/domain/enums/OtpType";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";
import { ICacheProvider } from "@/app/providers/CacheProvider";
import { REDIS_PREFIX } from "@/config/redis/prefixKeys";
import { VerifyNewEmailRequest } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // Import the logger


/**
 * Class representing the implementation of the verify new email use case.
 * * @class
 * @implements {IVerifyNewEmailUseCase}
 */
@injectable()
export class VerifyNewEmailUseCase implements IVerifyNewEmailUseCase {

    #_userRepository : IUserRepository
    #_otpService : IOtpService
    #_cacheProvider : ICacheProvider

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.IOtpService) otpService : IOtpService,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_userRepository = userRepository
        this.#_otpService = otpService
        this.#_cacheProvider = cacheProvider
    }

    async execute(
        request : VerifyNewEmailRequest
    ): Promise<ResponseDTO> {
        const dto : IVerifyNewEmailRequestDTO = {
            userId : request.userId,
            email : request.email,
            otp : request.otp
        }
        const { userId, email } = dto;
        
        // Log 1: Execution start
        logger.info('VerifyNewEmailUseCase execution started', { userId, newEmail: email });

        const user = await this.#_userRepository.findById(userId)
        
        if(!user){
            // Log 2A: User not found
            logger.warn('Email verification failed: account not found', { userId });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        
        // Log 2B: Verifying OTP
        logger.debug('Attempting to verify OTP for new email', { userId, email });
        const isVerified = await this.#_otpService.verifyOtp(
            email,
            OtpType.CHANGE_EMAIL,
            dto.otp
        )
        
        if(!isVerified){
            // Log 2C: OTP verification failed
            logger.warn('Email verification failed: invalid or expired OTP', { userId, email });
            return {
                data : null,
                message : AuthenticateUserErrorType.InvalidOrExpiredOtp,
                success : false
            }
        }

        // Log 3: OTP verified, updating user record
        logger.info('OTP verified. Updating user email address.', { userId, oldEmail: user.email, newEmail: email });
        
        // Clearing OTP after successful verification
        await this.#_otpService.clearOtp(
            email,
            OtpType.CHANGE_EMAIL
        );

        const userEntity = User.rehydrate(user);
        userEntity.update({ email : email });
        
        await this.#_userRepository.update(
            userId,
            userEntity.getUpdatedFields()
        );
        
        // Log 4: Cache invalidation
        const cacheKey = `${REDIS_PREFIX.USER_PROFILE}${userId}`
        logger.info('Email successfully updated in database. Invalidating profile cache key.', { userId, cacheKey });
        await this.#_cacheProvider.del(cacheKey);

        // Log 5: Execution successful
        logger.info('VerifyNewEmailUseCase completed successfully: Email address changed', { userId, newEmail: email });
        
        return {
            data : null,
            success : true
        }
    }
}