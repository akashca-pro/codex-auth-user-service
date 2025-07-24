import { AuthProvider } from "@/domain/enums/AuthProvider";
import { UserRole } from "@/domain/enums/UserRole";

/**
 * The Data Transfer Object (DTO) representing the output user data
 * 
 * @interface
 */
export interface IUserOutRequestDTO {
    userId : string;
    username : string;
    role : UserRole;
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