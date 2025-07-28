import { IUserRepository } from "@/app/repository/User";
import { ISignUpUserUseCase } from "../SignupUserUseCase";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { ResponseDTO } from "@/domain/dtos/Response";
import { ICreateLocalUserRequestDTO } from "@/domain/dtos/User/CreateUser";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { User } from "@/domain/entities/User";
import { LocalAuthentication } from "@/domain/valueObjects/UserAuthentication";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";

/**
 * Use case for Creating a user.
 * 
 * @class
 * @implements {ISignUpUserUseCase}
 */
export class SignupUserUseCase implements ISignUpUserUseCase {

    /**
     * Creates an instance of SignupUserUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {IPasswordHasher} passwordHasher - The password hasher provider for comparing hashed password.
     * @param {IOtpService} otpService - Otp service provider for verification.
     */
    constructor(
        private userRepository : IUserRepository,
        private passwordHasher : IPasswordHasher,
        private otpService : IOtpService
    ){}

    /**
     * Execute the create user use case.
     * 
     * @async
     * @param {ICreateUserRequestDTO} data - The user creation request data.
     * @return {ResponseDTO} - The response data.
     */
    async execute(data: ICreateLocalUserRequestDTO): Promise<ResponseDTO> {
        
        try {
        
            const userAlreadyExists = await this.userRepository.findByEmail(data.email);

            if(userAlreadyExists){
                return {
                    data : { message : UserErrorType.UserAlreadyExists },
                    success : false
                }
            }

            const hashedPassword = await this.passwordHasher.hashPassword(data.password);


            const userEntity = User.create({
                ...data,
                authentication : new LocalAuthentication(hashedPassword)
            })
            await this.userRepository.create(userEntity);

            await this.otpService.generateAndSendOtp(data.email,OtpType.SIGNUP);

            return {
                data : { message : UserSuccessType.OtpSendSuccess } , success : true
            }

        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }

    }

}