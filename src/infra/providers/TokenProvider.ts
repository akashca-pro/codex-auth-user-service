import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { config } from "@/config";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

/**
 * Provider for managing authentication tokens.
 * 
 * @class
 * @implements {ITokenProvider}
 */
export class TokenProvider implements ITokenProvider {

  private accessSecret: Secret = config.ACCESS_TOKEN_SECRET;
  private refreshSecret: Secret = config.REFRESH_TOKEN_SECRET;
  private accessExpiry = config.JWT_ACCESS_TOKEN_EXPIRY;
  private refreshExpiry = config.JWT_REFRESH_TOKEN_EXPIRY;


  /**
   * 
   * @param {ITokenPayLoadDTO} payload - The payload contain user info.
   * @returns {string} - The access token for the user.
   */
  generateAccessToken(payload: ITokenPayLoadDTO): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiry
    } as SignOptions);
  }

  /**
   * 
   * @param {ITokenPayLoadDTO} payload - The payload contain user info.
   * @return {string} - The refresh token for the user.
   */
  generateRefreshToken(payload: ITokenPayLoadDTO): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiry
    } as SignOptions);
  }


}

