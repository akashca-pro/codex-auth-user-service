import { IUserRepository } from "@/domain/repository/User";
import { ISignUpUserUseCase } from "../SignupUserUseCase";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IPasswordHasher } from "@/app/providers/PasswordHasher";
import { ResponseDTO } from "@/domain/dtos/Response";
import { ICreateLocalUserRequestDTO } from "@/domain/dtos/User/CreateUser";
import { User } from "@/domain/entities/User";
import { LocalAuthentication } from "@/domain/valueObjects/UserAuthentication";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { inject, injectable } from "inversify";
import TYPES from "@/config/inversify/types";

/**
 * Use case for Creating a user.
 * 
 * @class
 * @implements {ISignUpUserUseCase}
 */
@injectable()
export class SignupUserUseCase implements ISignUpUserUseCase {

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
     * Execute the create user use case.
     * 
     * @async
     * @param {ICreateUserRequestDTO} data - The user creation request data.
     * @return {ResponseDTO} - The response data.
     */
    async execute(data: ICreateLocalUserRequestDTO): Promise<ResponseDTO> {
        
        const userAlreadyExists = await this.#_userRepository.findByEmail(data.email);

        if(userAlreadyExists){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        const hashedPassword = await this.#_passwordHasher.hashPassword(data.password);


        const userEntity = User.create({
            ...data,
            authentication : new LocalAuthentication(hashedPassword)
        })
        await this.#_userRepository.create(userEntity);

        await this.#_otpService.generateAndSendOtp(data.email,OtpType.SIGNUP);

        return {
            data : null,
            message : UserSuccessType.OtpSendSuccess,
            success : true
        }
    }
}