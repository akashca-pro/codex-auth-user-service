// domain/valueObjects/UserAuthentication.ts

import { AuthProvider } from "../enums/AuthProvider";

/**
 * Abstract base class representing common user authentication logic.
 * Handles shared properties such as the authentication provider and verification status.
 *
 * @abstract
 * @class
 */
export abstract class UserAuthentication {
  protected _isVerified: boolean = false;

  /**
   * @constructor
   * @param {AuthProvider} authProvider - The authentication provider (LOCAL, GOOGLE, etc.)
   */
  protected constructor(protected readonly _authProvider: AuthProvider) {}

  /**
   * Returns the auth provider used by the user.
   *
   * @returns {AuthProvider}
   */
  get authProvider(): AuthProvider {
    return this._authProvider;
  }

  /**
   * Returns whether the user is verified.
   *
   * @returns {boolean}
   */
  get isVerified(): boolean {
    return this._isVerified;
  }

  /**
   * Marks the user as verified.
   */
  public markAsVerified(): void {
    this._isVerified = true;
  }
}

/**
 * Class representing authentication via the LOCAL provider.
 * Requires a password, and allows changing it.
 * 
 * @class
 * @extends {UserAuthentication}
 */
export class LocalAuthentication extends UserAuthentication {
  private _password: string;

  /**
   * @constructor
   * @param {string} password - The user's password
   */
  constructor(password: string) {
    super(AuthProvider.LOCAL);
    this._password = password;
  }

  /**
   * Returns the current password (if needed — avoid using in production).
   *
   * @returns {string}
   */
  get password(): string {
    return this._password;
  }

  /**
   * Updates the user's password.
   * 
   * @param {string} newPassword - The new password to set
   */
  public changePassword(newPassword: string): void {
    this._password = newPassword;
  }
}

/**
 * Class representing authentication via an external OAuth provider (e.g., Google, GitHub).
 * Requires an oAuthId, and disallows password logic.
 * 
 * @class
 * @extends {UserAuthentication}
 */
export class OAuthAuthentication extends UserAuthentication {
  private readonly _oAuthId: string;

  /**
   * @constructor
   * @param {Exclude<AuthProvider, AuthProvider.LOCAL>} provider - The OAuth provider (e.g., GOOGLE)
   * @param {string} oAuthId - The user's external OAuth ID
   */
  constructor(
    provider: Exclude<AuthProvider, AuthProvider.LOCAL>,
    oAuthId: string
  ) {
    super(provider);
    this._oAuthId = oAuthId;
  }

  /**
   * Returns the external OAuth ID.
   * 
   * @returns {string}
   */
  get oAuthId(): string {
    return this._oAuthId;
  }
}
