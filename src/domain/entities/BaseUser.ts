import { AuthProvider } from "../enums/AuthProvider";
import { UserRole } from "../enums/UserRole";
import { Email } from "../valueObjects/Email";

/**
 * Interface for BaseUser properties.
 */
export interface IBaseUserProps {
  userId : string;
  username: string;
  email: Email;
  role: UserRole;
  firstName: string;
  country: string;
  authProvider: AuthProvider;
  avatar?: string;
  lastName?: string;
  oAuthId?: string;
  password?: string;
  createdAt : Date;
  updatedAt : Date;
}

/**
 * Class representing the base user details that both entity should have.
 *
 * @class
 */
export abstract class BaseUser {
  
  constructor(
    protected readonly userId : string,
    protected readonly username: string,
    protected readonly email: Email,
    protected readonly role: UserRole,
    protected readonly firstName: string,
    protected readonly country: string,
    protected readonly authProvider: AuthProvider,
    protected readonly createdAt : Date,
    protected readonly updatedAt : Date,
    protected readonly avatar?: string,
    protected readonly lastName?: string,
    protected readonly oAuthId?: string,
    protected readonly password?: string
  ) {
    if (this.authProvider === AuthProvider.LOCAL && !this.password) {
      throw new Error("Password is required for Local auth provider");
    }

    if (this.authProvider !== AuthProvider.LOCAL && !this.oAuthId) {
      throw new Error(`oAuthId is required for ${this.authProvider} providers`);
    }
  }

}
