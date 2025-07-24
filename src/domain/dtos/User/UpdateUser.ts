import { UserRole } from "@/domain/enums/UserRole";


/**
 * Data Transfer Object (DTO) representing the request to update user 
 * 
 * @interface
 */
export interface IUpdateUserRequestDTO {

  username?: string;
  firstName?: string;
  lastName?: string | null;
  avatar? : string | null;
  email?: string;
  country?: string;
  role: UserRole;
  preferredLanguage? : string | null;
  easySolved?: number | null;
  mediumSolved?: number | null;
  hardSolved?: number | null;
  totalSubmission?: number | null;
  streak?: number | null;  
  updatedAt: Date;
}