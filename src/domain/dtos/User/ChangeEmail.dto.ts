
/**
 * Data Transfer Object (DTO) representing the request for change email use case.
 */
export interface IChangeEmailRequestDTO {
    newEmail : string;
    password : string;
}