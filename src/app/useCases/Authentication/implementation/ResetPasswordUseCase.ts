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

    /**
     * Creates an instance of ResetPasswordUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IPasswordHasher} passwordHasher - The password hasher provider for comparing hashed password.
     * @param {IOtpService} otpService - Otp service provider for verification.
     */
    constructor(
        @inject(TYPES.IUserRepository)
        private _userRepository : IUserRepository,

        @inject(TYPES.IPasswordHasher)
        private _passwordHasher : IPasswordHasher,

        @inject(TYPES.IOtpService)
        private _otpService : IOtpService,
    ){}

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
        
        try {

            const user = await this._userRepository.findByEmail(email);

            if(!user){
                return {data : { message : AuthenticateUserErrorType.AccountNotFound }, success : false}
            }

            if(!await this._otpService.verifyOtp(email,OtpType.FORGOT_PASS,otp)){
                return {
                    data : { message : AuthenticateUserErrorType.InvalidOrExpiredOtp},
                    success : false
                 }
            }

            const hashedPassword = await this._passwordHasher.hashPassword(newPassword);

            const userEntity = User.rehydrate(user);
            userEntity.update({
                password : hashedPassword
            })

            await this._userRepository.update(user.userId,userEntity.getUpdatedFields());

            return {
                data : { message : UserSuccessType.PasswordChangedSuccessfully },
                success : false
            }
            
        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }
    }

} 