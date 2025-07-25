/**
 * Data Transfer Object (DTO) represents the user's verification data.
 * 
 * @interface
 */
export interface IVerifySignUpOtp {
  /**
   * The email address of the user for authentication.
   */
   email : string;

   /**
    * The otp for verification which sent through the email.
    */
   otp : string
}