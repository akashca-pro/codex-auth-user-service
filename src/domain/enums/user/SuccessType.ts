/**
 * Enum representing success types related to user operations.
 *
 * @enum
 */
export enum UserSuccessType {
  /**
   * Success type indicating that the user was deleted successfully.
   */
  UserDeleted = 'User deleted with success!',

  /**
   * Success type indicating that the user verified account and sign up successfully
   */
  SignupSuccess = 'Sign up success',

  /**
   * Success type indicating that otp is sent to the user's email address
   */
  OtpSendSuccess = 'Otp sent to the registered email address',

  /**
   * Success type indicating that the new token issued based on refreshToken payload.
   */
  TokenIssued = 'Access token issued',

  /**
   * Success type indicating that the password has been reset successfully.
   */
  PasswordChangedSuccessfully = 'Password updated',

}
