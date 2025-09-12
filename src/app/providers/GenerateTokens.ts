import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";

/**
 * Interface for the provider responsible for
 * generates access and refresh token.
 * 
 * @interface
 */
export interface ITokenProvider {
    /**
     * Generate a new access token.
     * 
     * @param {ITokenPayLoadDTO} payload - The payload should contain user's identity.
     * @returns {string} - The generated access token.
     */
    generateAccessToken(payload : ITokenPayLoadDTO) : string;

    /**
     * Generate a new refresh token.
     * 
     * @param {ITokenPayLoadDTO} payload - The payload should contain user's identities.
     * @return {string} - The generated refresh token.
     */
    generateRefreshToken(payload : ITokenPayLoadDTO) : string;
}

