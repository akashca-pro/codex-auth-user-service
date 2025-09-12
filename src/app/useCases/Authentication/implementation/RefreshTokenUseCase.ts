import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { ITokenPayLoadDTO, IUserInfoPayload } from "@/domain/dtos/TokenPayload";
import { IRefreshTokenUseCase } from "../RefreshTokenUseCase";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { injectable, inject } from "inversify";
import { randomUUID } from "node:crypto";
import { IUserRepository } from "@/domain/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";

/**
 * Use case for issuing new accessToken.
 * 
 * @class
 * @implements {IRefreshTokenUseCase}
 */
@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {

    #_tokenProvider : ITokenProvider
    #_userRepository : IUserRepository

    /**
     * Creates an instance of RefreshTokenEndPointUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {ITokenProvider} tokenProvider - Token service provider for generating token.
     */
    constructor(
        @inject(TYPES.ITokenProvider)
        tokenProvider : ITokenProvider,

        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository,
    ){
        this.#_tokenProvider = tokenProvider
        this.#_userRepository = userRepository
    }

    /**
     * Executes the RefreshTokenEndPointUseCase use case.
     * 
     * @async
     * @param {ITokenPayLoadDTO} credentials - The credentials include decoded data from refreshToken.
     * @returns {ResponseDTO} - The response data.
     */
    async execute({ userId, email, role }: IUserInfoPayload ): Promise<ResponseDTO> {
        
        const payload : ITokenPayLoadDTO = {
            userId,
            email,
            role,
            tokenId : randomUUID()
        }

        const user = await this.#_userRepository.findById(userId)

        if(!user){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        if(user.isBlocked){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountBlocked,
                success : false
            }
        }

        const accessToken = this.#_tokenProvider.generateAccessToken(payload);

        return { 
            data : { 
                accessToken,
                userInfo : {
                    userId,
                    email,
                    role 
                }
                },
            message : UserSuccessType.TokenIssued,   
            success : true
        }
    }
}

