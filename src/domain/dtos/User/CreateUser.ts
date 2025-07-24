import { UserAuthentication } from "@/domain/valueObjects/UserAuthentication";

/**
 * Data Transfer Object (DTO) representing the request to create a new user.
 *
 * @interface
 */
export interface ICreateUserRequestDTO {
  username: string;
  email: string;
  firstName: string;
  lastName : string | null;
  avatar : string | null;
  country: string;
  authentication: UserAuthentication;
};

