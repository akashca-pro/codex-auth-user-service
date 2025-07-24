import { ICreateUserOutDTO, ICreateUserRequestDTO } from "../dtos/User/CreateUser";
import { IUpdateUserRequestDTO } from "../dtos/User/UpdateUser";
import { UserRole } from "../enums/UserRole";
import { Email } from "../valueObjects/Email";
import { LocalAuthentication, OAuthAuthentication, UserAuthentication } from "../valueObjects/UserAuthentication";

/**
 * Interface representing the base structure of user
 */
export interface IUserProps<T extends UserAuthentication = UserAuthentication>{
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
  isArchived: boolean;
  preferredLanguage : string | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
  totalSubmission: number | null;
  streak: number | null;
}

/**
 * Abstract class representing the base user details.
 */
export class User<T extends UserAuthentication = UserAuthentication> {
  private readonly _userId: string;
  private readonly _username: string;
  private readonly _email: Email;
  private readonly _role: UserRole;
  private readonly _firstName: string;
  private readonly _country: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _authentication: T;
  private readonly _avatar: string | null;
  private readonly _lastName: string | null;
  private readonly _isArchived: boolean;
  private readonly _preferredLanguage : string | null;
  private readonly _easySolved: number | null;
  private readonly _mediumSolved: number | null;
  private readonly _hardSolved: number | null;
  private readonly _totalSubmission: number | null;
  private readonly _streak: number | null;

  
  /**
   * Create a user instance based on the provided data
   * 
   * @param {IUserProps} data - The provided data to create instance of a user (normal or admin)
   * @returns {ICreateUserOutDTO} - The created user
   */
  static create<T extends UserAuthentication>(
    data : ICreateUserRequestDTO & {authentication : T}) : ICreateUserOutDTO {
    const id = crypto.randomUUID();
    const now = new Date();

    const isAdmin = data.role === UserRole.ADMIN;

    const instance = new User({
        userId: id,
        username: data.username,
        email: new Email({ address: data.email }),
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        country: data.country,
        authentication: data.authentication,
        createdAt: now,
        updatedAt: now,
        isArchived: false,
        
        // These values are specific based on role

        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
        preferredLanguage: isAdmin ? null : 'js' ,
        easySolved: isAdmin ? null : 0,
        mediumSolved: isAdmin ? null : 0,
        hardSolved: isAdmin ? null : 0,
        totalSubmission: isAdmin ? null : 0,
        streak: isAdmin ? null : 0
      });

      return instance.toObject();

  }

  toObject() : ICreateUserOutDTO {
    const auth = this.authentication;
    return {
      userId : this.userId,
      role : this.role,
      username : this.username,
      email : this.email.address,
      firstName : this.firstName,
      lastName : this.lastName,
      avatar : this.avatar,
      country : this.country,
      authProvider : auth.authProvider,
      password : auth instanceof LocalAuthentication ? auth.password : null,
      oAuthId : auth instanceof OAuthAuthentication ? auth.oAuthId : null,
      isVerified : auth.isVerified,
      isArchived: false,
      preferredLanguage: this.preferredLanguage,
      easySolved : this.easySolved,
      mediumSolved: this.mediumSolved,
      hardSolved: this.hardSolved,
      totalSubmission: this.totalSubmission,
      streak: this.streak,
      createdAt : this.createdAt,
      updatedAt : this.updatedAt
    }
  }

  /**
   * Updates the user instance with provided data.
   * 
   * @param {IUpdateUserRequestDTO} updatedData - The data to update a user.
   * @returns {IUpdateUserRequestDTO} - The updated data of the user
   */ 
  static update(updatedData : IUpdateUserRequestDTO) : IUpdateUserRequestDTO {
    const isAdmin = updatedData.role === UserRole.ADMIN;

    if(updatedData.email){
      updatedData.email = new Email({address : updatedData.email}).address
    }

    return {
      ...updatedData,
      preferredLanguage : isAdmin ?  null : updatedData.preferredLanguage,
      easySolved : isAdmin ?  null : updatedData.easySolved,
      mediumSolved : isAdmin ?  null : updatedData.mediumSolved,
      hardSolved : isAdmin ?  null : updatedData.hardSolved,
      totalSubmission : isAdmin ?  null : updatedData.totalSubmission,
      streak : isAdmin ?  null : updatedData.streak  
    }
  }

  constructor(props: IUserProps<T>) {
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
    this._isArchived = props.isArchived;
    this._preferredLanguage = props.preferredLanguage;
    this._easySolved = props.easySolved;
    this._mediumSolved = props.mediumSolved;
    this._hardSolved = props.hardSolved;
    this._totalSubmission = props.totalSubmission;
    this._streak = props.streak;
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

  get isArchived(): boolean {
    return this._isArchived;
  }

  get preferredLanguage(): string | null {
    return this._preferredLanguage;
  }

  get easySolved(): number | null {
    return this._easySolved;
  }

  get mediumSolved(): number | null {
    return this._mediumSolved;
  }

  get hardSolved(): number | null {
    return this._hardSolved;
  }

  get totalSubmission(): number | null {
    return this._totalSubmission;
  }

  get streak(): number | null {
    return this._streak;
  }

}
