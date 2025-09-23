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


/**
 * Class representing the implementation of the change email use case.
 * 
 * @class
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
        const user = await this.#_userRepository.findById(dto.userId)
        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        const emailExists = await this.#_userRepository.findByEmail(dto.newEmail);
        if(emailExists){
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailAlreadyExists,
                success : false
            }
        }
        if(!await this.#_passwordHasher.comparePasswords(dto.password, user.password!)){
            return {
                data : null,
                message : AuthenticateUserErrorType.IncorrectPassword,
                success : false
            }
        }
        await this.#_otpService.generateAndSendOtp(
            dto.newEmail,
            OtpType.CHANGE_EMAIL
        )
        return {
            data : null,
            success : true
        }
    }
}
