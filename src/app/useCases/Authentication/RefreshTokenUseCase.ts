import { ResponseDTO } from "@/domain/dtos/Response";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";

/**
 * Interface for the use case of issuing new access token based on refreshToken.
 *
 * This interface defines the contract for a use case responsible for validating
 * and generating new accessToken based on refreshToken.
 *
 * @interface
 */
export interface IRefreshTokenUseCase {

    /**
     * Execute the RefreshTokenEndPointUseCase.
     * 
     * @async
     * @param {ITokenPayLoadDTO} TokenPayload - Token payload of the user
     * @returns {Promise<ResponseDTO>} - The response data.
     * 
     * @remarks
     * This method is responsible for handling the logic of issuing new accessToken
     * based on the decoded token payload from the refreshToken.
     */
    execute({
        userId,
        email,
        role
    } : ITokenPayLoadDTO ) : Promise<ResponseDTO>

}