import { AuthProvider } from "@/domain/enums/AuthProvider";
import { UserRole } from "@/domain/enums/UserRole";
import { UserAuthentication } from "@/domain/valueObjects/UserAuthentication";

/**
 * Data Transfer Object (DTO) representing the request to create a new user.
 *
 * @interface
 */
export interface ICreateUserRequestDTO {
  role : UserRole;
  username: string;
  email: string;
  firstName: string;
  lastName : string | null;
  avatar : string | null;
  country: string;
  authentication: UserAuthentication;
};

/**
 * Data Tranfer Object (DTO) representing the output shape of a User,
 * suitable for returning to the application layer or persistence.
 * 
 * @interface
 */
export interface ICreateUserOutDTO {
  userId: string;
  username: string;
  firstName: string;
  lastName: string | null;
  avatar : string | null;
  email: string;
  country: string;
  role: UserRole;
  authProvider: AuthProvider;
  isVerified: boolean;
  password : string | null;     
  oAuthId : string | null;     
  isArchived: boolean;
  preferredLanguage : string | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
  totalSubmission: number | null;
  streak: number | null;  
  createdAt: Date;
  updatedAt: Date;
}
