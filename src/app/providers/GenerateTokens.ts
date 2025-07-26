
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
     * @param {object} payload - The payload should contain user's identity.
     * @returns {string} - The generated access token.
     */
    generateAccessToken(payload : object) : string;

    /**
     * Generate a new refresh token.
     * 
     * @param {string} payload - The payload should contain user's identities.
     * @return {string} - The generated refresh token.
     */
    generateRefreshToken(payload : object) : string;
}

