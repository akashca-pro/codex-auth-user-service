import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { IRefreshTokenUseCase } from "../RefreshTokenUseCase";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { injectable, inject } from "inversify";
import { randomUUID } from "node:crypto";
import { IUserRepository } from "@/domain/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { RefreshTokenRequest } from "@akashcapro/codex-shared-utils";
import { IRefreshTokenRequestDTO } from "@/domain/dtos/RefreshTokenRequest.dto";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Use case for issuing new accessToken.
 * * @class
 * @implements {IRefreshTokenUseCase}
 */
@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {

    #_tokenProvider : ITokenProvider
    #_userRepository : IUserRepository

    /**
     * Creates an instance of RefreshTokenEndPointUseCase.
     * * @param {IUserRepository} userRepository - The repository of the user.
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

    async execute(
        request : RefreshTokenRequest
    ): Promise<ResponseDTO> {
        // Log 1: Execution start
        logger.info('RefreshTokenUseCase execution started', { userId: request.userId, email: request.email });

        const dto : IRefreshTokenRequestDTO = {
            email : request.email,
            username : request.username,
            role : request.role,
            userId : request.userId
        }

        const user = await this.#_userRepository.findById(dto.userId)
        
        if(!user){
            // Log 2A: User not found
            logger.warn('RefreshTokenUseCase failed: account not found', { userId: dto.userId, email: dto.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }

        if(user.isBlocked){
            // Log 2B: Account blocked
            logger.warn('RefreshTokenUseCase failed: account is blocked', { userId: dto.userId, email: dto.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountBlocked,
                success : false
            }
        }
        
        // Log 3: Generating new access token
        logger.info('User validated, generating new access token', { userId: dto.userId, email: dto.email });

        const tokenPayload : ITokenPayLoadDTO = {
            userId : dto.userId,
            username : dto.username,
            email : dto.email,
            role : dto.role,
            tokenId : randomUUID() 
        }
        
        const accessToken = this.#_tokenProvider.generateAccessToken(tokenPayload);

        // Log 4: Execution successful
        logger.info('RefreshTokenUseCase completed successfully: New access token issued', { userId: dto.userId });

        return { 
            data : { accessToken,
                    userInfo : dto },
            message : UserSuccessType.TokenIssued,   
            success : true
        }
    }
}