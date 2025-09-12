/**
 * Enum representing error types thrown in entity.
 *
 * @enum
 */
export enum EntityErrorType {

  /**
   * Error type indicating that the user cannot set password for oAuth users.
   */
  CannotSetPassword = 'Cannot set password for OAuth-based user',

  /**
   * Error type indicating that the user is missing password during updation.
   */
  MissingPassword = 'Missing password for local auth user',

  /**
   * Error type indicating that the user is missing oAuth id during updating.
   */
  MissingOAuthId = 'Missing oAuthid for OAuth-based user'

}
