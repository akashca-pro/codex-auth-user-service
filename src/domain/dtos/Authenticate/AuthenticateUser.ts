/**
 * Data Transfer Object (DTO) representing local user authentication data.
 *
 * @interface
 */
export interface IAuthenticateLocalAuthUserDTO {
  /**
   * The email address of the user for authentication.
   */
  email: string;

  /**
   * The password of the user for authentication.
   */
  password: string;
}


/**
 *Data Tranfer Object (DTO) representing oAuth user authentication data
 *
 * @interface
 */
export interface IAuthenticateOAuthUserDTO  {
    /**
     * The email address of the user for authentication
     */
    email : string;

    /**
     * The oAuthId of the user for authentication
     */
    oAuthId : string;

    /**
     * The firstName of the user 
     */
    firstName : string;

    /**
     * The username of the user.
     */
    username : string;
}