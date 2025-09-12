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

/**
 * Use case for reset password.
 * 
 * @class
 * @implements {IResetPasswordUseCase}
 */
@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {

    #_userRepository : IUserRepository
    #_passwordHasher : IPasswordHasher
    #_otpService : IOtpService

    /**
     * Creates an instance of SignupUserUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
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
     * 
     * @async
     * @param {string} email - The email of the user.
     * @returns {ResponseDTO} - Ther response data.
     */
    async execute({
        email,
        otp,
        newPassword
    } : IResetPasswordDTO ): Promise<ResponseDTO> {

        const user = await this.#_userRepository.findByEmail(email);

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        if(!await this.#_otpService.verifyOtp(email,OtpType.FORGOT_PASS,otp)){
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false
            }
        }

        const hashedPassword = await this.#_passwordHasher.hashPassword(newPassword);

        const userEntity = User.rehydrate(user);
        userEntity.update({
            password : hashedPassword
        })

        await this.#_userRepository.update(user.userId,userEntity.getUpdatedFields());

        return {
            data : null,
            message : UserSuccessType.PasswordChangedSuccessfully,
            success : true
        }
    }
} 