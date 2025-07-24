/**
 * Enum representing error types related to user authentication.
 *
 * @enum
 */
export enum AuthenticateUserErrorType {
  /**
   * Error type indicating that the provided email or password is incorrect.
   */
  EmailOrPasswordWrong = 'Email or password incorrect.',

  /**
   * Error type indicating that only local auth users should allowed
   */
  AuthProviderWrong = 'OAuth users should only login via respective oAuth provider',



}
