import { AuthProvider } from "../enums/AuthProvider";
import { UserRole } from "../enums/UserRole";
import { Email } from "../valueObjects/Email";

type LocalAuthUser = {
  authProvider: AuthProvider.LOCAL;
  password: string;
  oAuthId?: never;
};

type OAuthUser = {
  authProvider: Exclude<AuthProvider, AuthProvider.LOCAL>;
  oAuthId: string;
  password?: never;
};

// Common fields
interface CommonUserFields {
  userId: string;
  username: string;
  email: Email;
  role: UserRole;
  firstName: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  lastName?: string;
}

// Final BaseUserProps type using discriminated union
export type IBaseUserProps = CommonUserFields & (LocalAuthUser | OAuthUser);


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
