/**
 * Data Transfer Object (DTO) representing the request to update user
 * 
 * @interface
 */

export interface IUpdateUserRequestDTO {

    username? : string;
    email? : string;
    firstName? : string;
    lastName? : string;
    password? : string;
    country? : string;
}