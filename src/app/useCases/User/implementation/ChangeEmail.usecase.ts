import { inject, injectable } from "inversify";
import { IChangeEmailUseCase } from "../ChangeEmail.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IChangeEmailRequestDTO } from "@/domain/dtos/User/ChangeEmail.dto";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";


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

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.IOtpService) otpService : IOtpService,
    ){
        this.#_userRepository = userRepository
        this.#_otpService = otpService
    }

    async execute(
        userId: string, 
        payload: IChangeEmailRequestDTO
    ): Promise<ResponseDTO> {

        const user = await this.#_userRepository.findById(userId)

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        const emailExists = await this.#_userRepository.findByEmail(payload.newEmail);

        if(emailExists){
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailAlreadyExists,
                success : false
            }
        }

        await this.#_otpService.generateAndSendOtp(
            payload.newEmail,
            OtpType.CHANGE_EMAIL
        )

        return {
            data : null,
            success : true
        }
    }
}
