import TYPES from "@/config/inversify/types";
import { ResponseDTO } from "@/domain/dtos/Response";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { IRefreshTokenUseCase } from "../RefreshTokenUseCase";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { injectable, inject } from "inversify";
import { randomUUID } from "node:crypto";

/**
 * Use case for issuing new accessToken.
 * 
 * @class
 * @implements {IRefreshTokenUseCase}
 */
@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {

    /**
     * Creates an instance of RefreshTokenEndPointUseCase.
     * 
     * @param {ITokenProvider} tokenProvider - Token service provider for generating token.
     */
    constructor(
        @inject(TYPES.ITokenProvider)
        private tokenProvider : ITokenProvider,
    ){}

    /**
     * Executes the RefreshTokenEndPointUseCase use case.
     * 
     * @async
     * @param {ITokenPayLoadDTO} credentials - The credentials include decoded data from refreshToken.
     * @returns {ResponseDTO} - The response data.
     */
    async execute({ userId, email, role }: ITokenPayLoadDTO): Promise<ResponseDTO> {
        
        try {
            const payload : ITokenPayLoadDTO = {
                userId,
                email,
                role,
                jti : randomUUID()
            }

            const accessToken = this.tokenProvider.generateAccessToken(payload);

            return { 
                data : { 
                    accessToken,
                    message : UserSuccessType.TokenIssued,
                    userInfo : payload
                 },    
                success : true
            }

        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }

    }

}

