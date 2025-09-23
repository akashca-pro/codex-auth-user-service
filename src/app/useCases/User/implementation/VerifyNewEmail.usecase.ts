import { inject, injectable } from "inversify";
import { IVerifyNewEmailUseCase } from "../VerifyNewEmail.usecase.interface";
import { IUserRepository } from "@/domain/repository/User";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IVerifyNewEmailRequestDTO } from "@/domain/dtos/User/VerifyNewEmail.dto";
import { OtpType } from "@/domain/enums/OtpType";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { User } from "@/domain/entities/User";
import { ICacheProvider } from "@/app/providers/CacheProvider";
import { REDIS_PREFIX } from "@/config/redis/prefixKeys";
import { VerifyNewEmailRequest } from "@akashcapro/codex-shared-utils";


/**
 * Class representing the implementation of the verify new email use case.
 * 
 * @class
 * @implements {IVerifyNewEmailUseCase}
 */
@injectable()
export class VerifyNewEmailUseCase implements IVerifyNewEmailUseCase {

    #_userRepository : IUserRepository
    #_otpService : IOtpService
    #_cacheProvider : ICacheProvider

    constructor(
        @inject(TYPES.IUserRepository) userRepository : IUserRepository,
        @inject(TYPES.IOtpService) otpService : IOtpService,
        @inject(TYPES.ICacheProvider) cacheProvider : ICacheProvider
    ){
        this.#_userRepository = userRepository
        this.#_otpService = otpService
        this.#_cacheProvider = cacheProvider
    }

    async execute(
        request : VerifyNewEmailRequest
    ): Promise<ResponseDTO> {
        const dto : IVerifyNewEmailRequestDTO = {
            userId : request.userId,
            email : request.email,
            otp : request.otp
        }
        const user = await this.#_userRepository.findById(dto.userId)
        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        const isVerified = await this.#_otpService.verifyOtp(
            dto.email,
            OtpType.CHANGE_EMAIL,
            dto.otp
        )
        if(!isVerified){
            return {
                data : null,
                message : AuthenticateUserErrorType.InvalidOrExpiredOtp,
                success : false
            }
        }
        await this.#_otpService.clearOtp(
            dto.email,
            OtpType.CHANGE_EMAIL
        )
        const userEntity = User.rehydrate(user);
        userEntity.update({ email : dto.email });
        await this.#_userRepository.update(
            dto.userId,
            userEntity.getUpdatedFields()
        )
        const cacheKey = `${REDIS_PREFIX.USER_PROFILE}${dto.userId}`
        await this.#_cacheProvider.del(cacheKey);
        return {
            data : null,
            success : true
        }
    }
}