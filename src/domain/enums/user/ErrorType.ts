/**
 * Enum representing error types related to user operations.
 *
 * @enum
 */
export enum UserErrorType {
  /**
   * Error type indicating that the user already exists.
   */
  UserAlreadyExists = 'User already exists!',

  /**
   * Error type indicating that the user does not exist.
   */
  UserDoesNotExist = 'User does not exist!',

  /**
   * Error type indicating that no users were found.
   */
  UserNotFound = 'Users not found',

  /**
   * Error type indicating that the error encountered while issuing access token
   */
  AccessTokenIssueError = 'Error issuing access token',

  /**
   * Error type indicating that the error encountered while issuing refresh token.
   */
  RefreshTokenIssueError = 'Error issuing refresh token',

  /**
   * Error type indicating that the user already verified
   */
   AlreadyVerified = 'User already verified',

   /**
    * Error type indicating that the country code in not valid.
    */
   InvalidCountryCode = 'Invalid country code',
}
