import { UserRole } from "@/generated/prisma";

/**
 * Data Transfer Object (DTO) representing local user authentication data.
 *
 * @interface
 */
export interface IAuthenticateLocalAuthUserDTO {
  /**
   * The email address of the user for authentication.
   */
  email: string;

  /**
   * The password of the user for authentication.
   */
  password: string;

  /**
   * The role of the user.
   */
  role : UserRole
}
