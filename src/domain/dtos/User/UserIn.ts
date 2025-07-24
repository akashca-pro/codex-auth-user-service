import { AuthProvider } from "@/domain/enums/AuthProvider";
import { UserRole } from "@/domain/enums/UserRole";

/**
 * Data Transfer Object (DTO) representing the input user data.
 * 
 * @interface
 */
export interface IRegularUserInRequestDTO {
    userId : string;
    role : UserRole;
    username : string;
    firstName : string;
    lastName? : string;
    avatar? : string;
    email : string;
    provider : AuthProvider;
    password? : string;
    googleId? : string;
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