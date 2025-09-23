/**
 * Data Transfer Object (DTO) representing the request to update user profile details.
 * 
 * @interface
 */
export interface IUpdateUserProfileRequestDTO {
    username? : string;
    firstName? : string;
    lastName? : string;
    country? : string;
    preferredLanguage? : string;
    avatar? : string;
}