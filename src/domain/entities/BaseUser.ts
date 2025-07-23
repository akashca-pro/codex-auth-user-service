import { AuthProvider } from "../enums/AuthProvider";
import { UserRole } from "../enums/UserRole";

/**
 * Interface for BaseUser properties.
 */
interface BaseUserProps {
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  country: string;
  authProvider: AuthProvider;
  avatar?: string;
  lastName?: string;
  oAuthId?: string;
  password?: string;
}

/**
 * Class representing the base user details that both entity should have.
 *
 * @class
 */
export abstract class BaseUser {
  public readonly username: string;
  public readonly email: string;
  public readonly role: UserRole;
  public readonly firstName: string;
  public readonly country: string;
  public readonly authProvider: AuthProvider;
  public readonly avatar?: string;
  public readonly lastName?: string;
  public readonly oAuthId?: string;
  public readonly password?: string;

  constructor(props: BaseUserProps) {
    const {
      username,
      email,
      role,
      firstName,
      country,
      authProvider,
      avatar,
      lastName,
      oAuthId,
      password,
    } = props;

    if (authProvider === AuthProvider.LOCAL && !password) {
      throw new Error("Password is required for Local auth provider");
    }

    if (authProvider !== AuthProvider.LOCAL && !oAuthId) {
      throw new Error(`oAuthId is required for ${authProvider} providers`);
    }

    this.username = username;
    this.email = email;
    this.role = role;
    this.firstName = firstName;
    this.country = country;
    this.authProvider = authProvider;
    this.avatar = avatar;
    this.lastName = lastName;
    this.oAuthId = oAuthId;
    this.password = password;
  }
}
