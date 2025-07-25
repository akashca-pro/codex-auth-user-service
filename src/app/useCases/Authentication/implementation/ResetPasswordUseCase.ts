import { IUserRepository } from "@/app/repository/User";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { IResetPasswordDTO } from "@/domain/dtos/Authenticate/ResetPassword";
import { IResetPasswordUseCase } from "../ResetPasswordUseCase";
import { User } from "@/domain/entities/User";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";

/**
 * Use case for reset password.
 * 
 * @class
 * @implements {IResetPasswordUseCase}
 */
export class ResetPasswordUseCase implements IResetPasswordUseCase {

    /**
     * Executes reset password use case.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IPasswordHasher} passwordHasher - The password hasher provider for comparing hashed password.
     * @param {IOtpService} otpService - Otp service provider for verification.
     */
    constructor(
        private userRepository : IUserRepository,
        private otpService : IOtpService,
        private passwordHasher : IPasswordHasher
    ){}

    /**
     * 
     * @param {string} email 
     */
    async execute({
        email,
        otp,
        newPassword
    } : IResetPasswordDTO ): Promise<ResponseDTO> {
        
        try {

            const user = await this.userRepository.findByEmail(email);

            if(!user){
                return {data : { message : AuthenticateUserErrorType.AccountNotFound }, success : false}
            }

            if(!await this.otpService.verifyOtp(email,OtpType.FORGOT_PASS,otp)){
                return {
                    data : { message : AuthenticateUserErrorType.InvalidOrExpiredOtp},
                    success : false
                 }
            }

            const hashedPassword = await this.passwordHasher.hashPassword(newPassword);

            const userEntity = User.rehydrate(user);
            userEntity.update({
                password : hashedPassword
            })

            await this.userRepository.update(user,userEntity.getUpdatedFields());

            return {
                data : { message : UserSuccessType.PasswordChangedSuccessfully },
                success : false
            }
            
        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }
    }

} 