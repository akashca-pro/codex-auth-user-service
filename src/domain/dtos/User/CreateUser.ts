import { UserRole } from "@/domain/enums/UserRole";
import { UserAuthentication } from "@/domain/valueObjects/UserAuthentication";

/**
 * Data Transfer Object (DTO) representing the request to create a new user.
 *
 * @interface
 */
export interface ICreateLocalUserRequestDTO {
  role : UserRole;
  username: string;
  email: string;
  firstName: string;
  lastName : string | null;
  avatar : string | null;
  country: string | null;
  password : string;
};

export interface ICreateOAuthUserRequestDTO {
  role : UserRole;
  email : string;
  firstName : string;
  avatar : string | null;
  oAuthId : string;
}

export interface ICreateUserRequestEntityDTO {
  role : UserRole;
  username: string;
  email: string;
  firstName: string;
  lastName : string | null;
  avatar : string | null;
  country: string | null;
  authentication: UserAuthentication;
};