
/**
 *  * Data Transfer Object (DTO) representing the request for verify new email use case.
 */
export interface IVerifyNewEmailRequestDTO {
    email : string;
    otp : string;
}