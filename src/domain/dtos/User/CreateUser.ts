/**
 * Data Transfer Object (DTO) representing the request to create new user
 * 
 * @interface
 */
export interface ICreateUserRequestDTO {
    username : string;
    email : string;
    firstName : string;
    lastName : string;
    password : string;
    country : string;
}
