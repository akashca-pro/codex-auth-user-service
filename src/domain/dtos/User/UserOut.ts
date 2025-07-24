import { AuthProvider } from "@/domain/enums/AuthProvider";

/**
 * The Data Transfer Object (DTO) representing the output user data
 * 
 * @interface
 */
export interface IUserOutRequestDTO {
    userId : string;
    username : string;
    email : string;
    firstName : string;
    lastName? : string;
    avatar? : string;
    country : string;
    preferredLanguage? : string;
    easySolved?: number;
    mediumSolved?: number;
    hardSolved?: number;
    totalSubmission?: number;
    streak?: number;
    createdAt : Date;
    updatedAt : Date;
}