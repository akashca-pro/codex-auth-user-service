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
    lastName : string | null;
    avatar : string | null;
    authProvider : AuthProvider;
    password : string | null;
    oAuthId : string | null;
    country : string | null;
    isVerified : boolean;
    isArchived : boolean;
    isBlocked : boolean;
    preferredLanguage : string | null;
    easySolved: number | null;
    mediumSolved : number | null;
    hardSolved : number | null;
    totalSubmission : number | null;
    streak : number | null;
    createdAt : Date;
    updatedAt : Date;
}