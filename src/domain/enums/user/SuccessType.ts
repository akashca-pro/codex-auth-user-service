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
   * Success type indicating that the account is verified and signed up successfully
   */
  SignupSuccess = 'Sign up success',

  /**
   * Success type indicating that the account is verified and Google auth successfully
   */
  GoogleAuthSuccess = 'Google auth success',

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

  /**
   * Success type indicating that the profile has been updated successfully.
   */
  ProfileUpdated = 'Profile updated',

  /**
   * Success type indicating that the profile data has been loaded.
   */
  ProfileLoaded = 'Profile details loaded successfully'

}
