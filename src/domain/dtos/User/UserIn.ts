import { AuthProvider } from "@/domain/enums/AuthProvider";
import { UserRole } from "@/domain/enums/UserRole";

/**
 * Data Transfer Object (DTO) representing the input user data.
 * 
 * @interface
 */
export interface IUserInRequestDTO {
    userId : string;
    role : UserRole;
    email : string;
    username : string;
    firstName : string;
    lastName? : string;
    avatar? : string;
    authProvider : AuthProvider;
    password? : string;
    oAuthId? : string;
    country : string;
    isVerified : boolean;
    isArchived : boolean;
    preferredLanguage?: string;
    easySolved?: number;
    mediumSolved?: number;
    hardSolved?: number;
    totalSubmission?: number;
    streak?: number;
    createdAt : Date;
    updatedAt : Date;
}