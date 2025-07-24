import { UserRole } from "../enums/UserRole";
import { Email } from "../valueObjects/Email";
import { UserAuthentication } from "../valueObjects/UserAuthentication";

/**
 * Interface representing the base structure of user
 */
export interface IBaseUserProps<T extends UserAuthentication = UserAuthentication>{
  userId: string;
  role: UserRole;
  username: string;
  email: Email;
  authentication: T;
  firstName: string;
  lastName: string | null;
  country: string;
  avatar : string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Abstract class representing the base user details.
 */
export abstract class BaseUser<T extends UserAuthentication = UserAuthentication> {
  protected readonly _userId: string;
  protected readonly _username: string;
  protected readonly _email: Email;
  protected readonly _role: UserRole;
  protected readonly _firstName: string;
  protected readonly _country: string;
  protected readonly _createdAt: Date;
  protected readonly _updatedAt: Date;
  protected readonly _authentication: T;
  protected readonly _avatar: string | null;
  protected readonly _lastName: string | null;

  constructor(props: IBaseUserProps<T>) {
    this._userId = props.userId;
    this._username = props.username;
    this._email = props.email;
    this._role = props.role;
    this._firstName = props.firstName;
    this._country = props.country;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._authentication = props.authentication;
    this._avatar = props.avatar;
    this._lastName = props.lastName;
  }

  get userId(): string {
    return this._userId;
  }

  get username(): string {
    return this._username;
  }

  get email(): Email {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get firstName(): string {
    return this._firstName;
  }

  get country(): string {
    return this._country;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get authentication(): T {
    return this._authentication;
  }

  get avatar(): string | null {
    return this._avatar;
  }

  get lastName(): string | null {
    return this._lastName;
  }
}
