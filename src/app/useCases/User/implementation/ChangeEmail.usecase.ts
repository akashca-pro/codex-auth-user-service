import { inject, injectable } from "inversify";
import { IChangeEmailUseCase } from "../ChangeEmail.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IChangeEmailRequestDTO } from "@/domain/dtos/User/ChangeEmail.dto";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { ChangeEmailRequest } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // Import the logger


/**
 * Class representing the implementation of the change email use case.
 * * @class
 * @implements {IChangeEmailUseCase}
 */
@injectable()
export class ChangeEmailUseCase implements IChangeEmailUseCase {

    #_userRepository : IUserRepository
    #_otpService : IOtpService
    #_passwordHasher : IPasswordHasher

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.IOtpService) otpService : IOtpService,
        @inject(TYPES.IPasswordHasher) passwordHasher : IPasswordHasher
    ){
        this.#_userRepository = userRepository
        this.#_otpService = otpService
        this.#_passwordHasher = passwordHasher
    }

    async execute(
       request : ChangeEmailRequest
    ): Promise<ResponseDTO> {
        const dto : IChangeEmailRequestDTO = {
            userId : request.userId,
            newEmail : request.newEmail,
            password : request.password
        }
        
        // Log 1: Execution start
        logger.info('ChangeEmailUseCase execution started', { userId: dto.userId, newEmail: dto.newEmail });

        const user = await this.#_userRepository.findById(dto.userId)
        
        if(!user){
            // Log 2A: User not found
            logger.warn('ChangeEmailUseCase failed: account not found', { userId: dto.userId });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        
        // Log 2B: Checking if new email already exists
        const emailExists = await this.#_userRepository.findByEmail(dto.newEmail);
        if(emailExists){
            // Log 2C: New email already in use
            logger.warn('ChangeEmailUseCase failed: new email already exists', { userId: dto.userId, newEmail: dto.newEmail });
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailAlreadyExists,
                success : false
            }
        }
        
        // Log 2D: Verifying password
        if(!user.password || !await this.#_passwordHasher.comparePasswords(dto.password, user.password)){
            // Log 2E: Incorrect password
            logger.warn('ChangeEmailUseCase failed: incorrect password', { userId: dto.userId });
            return {
                data : null,
                message : AuthenticateUserErrorType.IncorrectPassword,
                success : false
            }
        }
        
        // Log 3: Password verified, generating and sending OTP to new email
        logger.info('Password verified. Generating and sending OTP to new email for confirmation', { userId: dto.userId, newEmail: dto.newEmail });

        await this.#_otpService.generateAndSendOtp(
            dto.newEmail,
            OtpType.CHANGE_EMAIL
        )
        
        // Log 4: Execution successful
        logger.info('ChangeEmailUseCase completed successfully: OTP sent to new email', { userId: dto.userId, newEmail: dto.newEmail });

        return {
            data : null,
            success : true
        }
    }
}