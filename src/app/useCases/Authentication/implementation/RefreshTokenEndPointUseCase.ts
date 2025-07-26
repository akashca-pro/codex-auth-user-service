import { ResponseDTO } from "@/domain/dtos/Response";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { IRefreshTokenEndPointUseCase } from "../RefreshTokenEndpoint";
import { ITokenService } from "@/app/providers/GenerateTokens";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";

/**
 * Use case for issuing new accessToken.
 * 
 * @class
 * @implements {IRefreshTokenEndPointUseCase}
 */
export class RefreshTokenEndPointUseCase implements IRefreshTokenEndPointUseCase {

    /**
     * Creates an instance of RefreshTokenEndPointUseCase.
     * 
     * @param {ITokenService} tokenService - Token service provider for generating token.
     */
    constructor(
        private tokenService : ITokenService
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
                role
            }

            const accessToken = this.tokenService.generateAccessToken(payload);

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

