import TYPES from "@/config/inversify/types";
import { IUserRepository } from "@/domain/repository/User";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { IResetPasswordDTO } from "@/domain/dtos/Authenticate/ResetPassword";
import { IResetPasswordUseCase } from "../ResetPasswordUseCase";
import { User } from "@/domain/entities/User";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { inject, injectable } from "inversify";
import { ResetPasswordRequest } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Use case for reset password.
 * * @class
 * @implements {IResetPasswordUseCase}
 */
@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {

    #_userRepository : IUserRepository
    #_passwordHasher : IPasswordHasher
    #_otpService : IOtpService

    /**
     * Creates an instance of SignupUserUseCase.
     * * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IPasswordHasher} passwordHasher - The password hasher provider for comparing hashed password.
     * @param {IOtpService} otpService - Otp service provider for verification.
     */
    constructor(
        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository,

        @inject(TYPES.IPasswordHasher)
        passwordHasher : IPasswordHasher,

        @inject(TYPES.IOtpService)
        otpService : IOtpService
    ){
        this.#_otpService = otpService,
        this.#_passwordHasher = passwordHasher,
        this.#_userRepository = userRepository 
    }

    /**
     * Executes the reset password use case.
     * * @async
     * @param {string} email - The email of the user.
     * @returns {ResponseDTO} - Ther response data.
     */
    async execute(
        request : ResetPasswordRequest
    ): Promise<ResponseDTO> {
        const dto : IResetPasswordDTO = {
            email : request.email,
            newPassword : request.newPassword,
            otp : request.otp
        }
        
        // Log 1: Execution start
        logger.info('ResetPasswordUseCase execution started', { email: dto.email });

        const user = await this.#_userRepository.findByEmail(dto.email);
        
        if(!user){
            // Log 2A: User not found
            logger.warn('Password reset failed: account not found', { email: dto.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        
        // Log 2B: Verifying OTP
        logger.debug('Verifying OTP for password reset', { userId: user.userId, email: dto.email });
        if(!await this.#_otpService.verifyOtp(
            dto.email,
            OtpType.FORGOT_PASS,
            dto.otp)
        ){
            // Log 2C: OTP verification failed
            logger.warn('Password reset failed: invalid OTP', { userId: user.userId, email: dto.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false
            }
        }
        
        // Log 3: OTP verified, proceeding to hash and update
        logger.info('OTP verified. Hashing new password and updating user', { userId: user.userId });

        const hashedPassword = await this.#_passwordHasher.hashPassword(dto.newPassword);
        
        const userEntity = User.rehydrate(user);
        userEntity.update({
            password : hashedPassword
        })
        
        await this.#_userRepository.update(user.userId,userEntity.getUpdatedFields());

        // Log 4: Execution successful
        logger.info('ResetPasswordUseCase completed successfully: password changed', { userId: user.userId });

        return {
            data : null,
            message : UserSuccessType.PasswordChangedSuccessfully,
            success : true
        }
    }
}