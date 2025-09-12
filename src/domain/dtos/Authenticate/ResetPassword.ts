/**
 * Data Transfer Object (DTO) represents the user's data for reset password.
 * 
 * @interface
 */
export interface IResetPasswordDTO {

  /**
   * The email address of the user for authentication.
   */
   email : string;

   /**
    * The otp for verification which sent through the email.
    */
   otp : string

   /**
    * The password to reset the current password.
    */
   newPassword : string;        
}