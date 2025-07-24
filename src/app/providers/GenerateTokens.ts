
/**
 * Interface for the provider responsible for
 * generates access and refresh token.
 * 
 * @interface
 */
export interface ITokenService {
    /**
     * Generate a new access token.
     * 
     * @param {object} payload 
     * @returns {string}
     */
    generateAccessToken(payload : object) : string;

    /**
     * Generate a new refresh token.
     * 
     * @param {string} payload 
     * @return {string}
     */
    generateRefreshToken(payload : object) : string;
}

