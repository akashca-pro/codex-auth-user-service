import { IUserRepository } from "@/domain/repository/User";
import { ISignUpUserUseCase } from "../SignupUserUseCase.interface";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { ResponseDTO } from "@/domain/dtos/Response";
import { User } from "@/domain/entities/User";
import { LocalAuthentication } from "@/domain/valueObjects/UserAuthentication";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";
import { SignupRequest } from "@akashcapro/codex-shared-utils";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { UserRole } from "@/domain/enums/UserRole";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Use case for Creating a user.
 * * @class
 * @implements {ISignUpUserUseCase}
 */
@injectable()
export class SignupUserUseCase implements ISignUpUserUseCase {

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

    async execute(
       request : SignupRequest
    ): Promise<ResponseDTO> {
        const dto = UserMapper.toCreateLocalAuthUserDTO(
            request,
            UserRole.USER
        );
        
        // Log 1: Execution start
        logger.info('SignupUserUseCase execution started', { email: dto.email, username: dto.username });

        const userAlreadyExists = await this.#_userRepository.findByEmail(dto.email);
        const usernameAlreadyExists = await this.#_userRepository.findByUsername(dto.username);
        
        if(userAlreadyExists){
            // Log 2A: Email already exists
            logger.warn('Signup failed: account already exists with this email', { email: dto.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountAlreadyExist,
                success : false
            }
        }
        
        if(usernameAlreadyExists){
            // Log 2B: Username already exists
            logger.warn('Signup failed: username already taken', { username: dto.username });
            return {
                data : null,
                message : AuthenticateUserErrorType.UsernameAlreadyExists,
                success : false
            }
        }
        
        // Log 3: Validation passed, hashing password
        logger.debug('Validation passed. Hashing password and creating user entity.', { email: dto.email });

        const hashedPassword = await this.#_passwordHasher.hashPassword(dto.password);
        
        const userEntity = User.create({
            ...dto,
            authentication : new LocalAuthentication(hashedPassword)
        });
        
        const newUser = await this.#_userRepository.create(userEntity);

        // Log 4: User created, sending OTP
        logger.info('User account created successfully. Sending sign-up OTP.', { email: dto.email });

        await this.#_otpService.generateAndSendOtp(dto.email,OtpType.SIGNUP);
        
        // Log 5: Execution successful
        logger.info('SignupUserUseCase completed successfully: OTP sent', { email: dto.email });

        return {
            data : null,
            message : UserSuccessType.OtpSendSuccess,
            success : true
        }
    }
}