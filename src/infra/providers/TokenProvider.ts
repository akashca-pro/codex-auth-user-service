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
export class JwtTokenProvider implements ITokenProvider {

  private _accessSecret: Secret = config.ACCESS_TOKEN_SECRET;
  private _refreshSecret: Secret = config.REFRESH_TOKEN_SECRET;
  private _accessExpiry = config.JWT_ACCESS_TOKEN_EXPIRY;
  private _refreshExpiry = config.JWT_REFRESH_TOKEN_EXPIRY;


  /**
   * 
   * @param {ITokenPayLoadDTO} payload - The payload contain user info.
   * @returns {string} - The access token for the user.
   */
  generateAccessToken(payload: ITokenPayLoadDTO): string {
    return jwt.sign(payload, this._accessSecret, {
      expiresIn: this._accessExpiry
    } as SignOptions);
  }

  /**
   * 
   * @param {ITokenPayLoadDTO} payload - The payload contain user info.
   * @return {string} - The refresh token for the user.
   */
  generateRefreshToken(payload: ITokenPayLoadDTO): string {
    return jwt.sign(payload, this._refreshSecret, {
      expiresIn: this._refreshExpiry
    } as SignOptions);
  }


}

