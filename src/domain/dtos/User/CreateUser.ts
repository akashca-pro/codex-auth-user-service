import { UserAuthentication } from "@/domain/valueObjects/UserAuthentication"

/**
 * Data Transfer Object (DTO) representing the request to create a new user.
 *
 * @interface
 */
export interface ICreateUserRequestDTO {
    userId : string;
    username : string;
    role : string;
    email : string;
    firstName : string;
    lastName? : string;
    country : string;
    authentication : UserAuthentication;
    avatar? : string;
    createdAt : string;
    updatedAt : string;    
}

