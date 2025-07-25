import { AuthProvider } from "../enums/AuthProvider"; 
import { ICreateUserRequestDTO } from "../dtos/User/CreateUser";
import { IUpdateUserRequestDTO } from "../dtos/User/UpdateUser";
import { IUserInRequestDTO } from "../dtos/User/UserIn";
import { UserRole } from "../enums/UserRole";
import { Email } from "../valueObjects/Email";
import { LocalAuthentication, OAuthAuthentication, UserAuthentication } from "../valueObjects/UserAuthentication";
import { EntityErrorType } from "../enums/entity/ErrorType";
import { UserField } from "../enums/user/UserUpdateFields";

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
  country: string | null;
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
  private readonly _role: UserRole;
  private readonly _createdAt: Date;
  private _username: string;
  private _email: Email;
  private _firstName: string;
  private _country: string | null;
  private _updatedAt: Date;
  private _authentication: T;
  private _avatar: string | null;
  private _lastName: string | null;
  private _isArchived: boolean;
  private _preferredLanguage : string | null;
  private _easySolved: number | null;
  private _mediumSolved: number | null;
  private _hardSolved: number | null;
  private _totalSubmission: number | null;
  private _streak: number | null;

  private _updatedFields : Partial<IUpdateUserRequestDTO> = {}

  
  /**
   * Create a user instance based on the provided data
   * 
   * @param {IUserProps} data - The provided data to create instance of a user (normal or admin).
   * @returns {IUserInRequestDTO} - The created user details.
   */
  static create<T extends UserAuthentication>(
    data : ICreateUserRequestDTO & {authentication : T}) : IUserInRequestDTO {
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

  /**
   * Updates the user instance with provided data.
   * 
   * @param {IUpdateUserRequestDTO} updatedData - The data to update a user.
   */ 
update(updatedData: IUpdateUserRequestDTO) {
  const isAdmin = this._role === UserRole.ADMIN;

  if (
    updatedData.username &&
    this.trackUpdate(UserField.Username, this._username, updatedData.username)
  ) {
    this._username = updatedData.username;
  }

  if (
    updatedData.firstName &&
    this.trackUpdate(UserField.FirstName, this._firstName, updatedData.firstName)
  ) {
    this._firstName = updatedData.firstName;
  }

  if (
    updatedData.lastName !== undefined &&
    this.trackUpdate(UserField.LastName, this._lastName, updatedData.lastName)
  ) {
    this._lastName = updatedData.lastName;
  }

  if (
    updatedData.avatar !== undefined &&
    this.trackUpdate(UserField.Avatar, this._avatar, updatedData.avatar)
  ) {
    this._avatar = updatedData.avatar;
  }

  if (
    updatedData.country !== undefined &&
    this.trackUpdate(UserField.Country, this._country, updatedData.country)
  ) {
    this._country = updatedData.country;
  }

  // Role-based checks
  if (
    !isAdmin &&
    updatedData.preferredLanguage !== undefined &&
    this.trackUpdate(UserField.PreferredLanguage, this._preferredLanguage, updatedData.preferredLanguage)
  ) {
    this._preferredLanguage = updatedData.preferredLanguage;
  }

  if (
    !isAdmin &&
    updatedData.easySolved !== undefined &&
    this.trackUpdate(UserField.EasySolved, this._easySolved, updatedData.easySolved)
  ) {
    this._easySolved = updatedData.easySolved;
  }

  if (
    !isAdmin &&
    updatedData.mediumSolved !== undefined &&
    this.trackUpdate(UserField.MediumSolved, this._mediumSolved, updatedData.mediumSolved)
  ) {
    this._mediumSolved = updatedData.mediumSolved;
  }

  if (
    !isAdmin &&
    updatedData.hardSolved !== undefined &&
    this.trackUpdate(UserField.HardSolved, this._hardSolved, updatedData.hardSolved)
  ) {
    this._hardSolved = updatedData.hardSolved;
  }

  if (
    !isAdmin &&
    updatedData.totalSubmission !== undefined &&
    this.trackUpdate(UserField.TotalSubmission, this._totalSubmission, updatedData.totalSubmission)
  ) {
    this._totalSubmission = updatedData.totalSubmission;
  }

  if (
    !isAdmin &&
    updatedData.streak !== undefined &&
    this.trackUpdate(UserField.Streak, this._streak, updatedData.streak)
  ) {
    this._streak = updatedData.streak;
  }

  if (updatedData.isVerified && !this._authentication.isVerified) {
    this._authentication.markAsVerified();
    this._updatedFields.isVerified = true;
  }

  if (updatedData.password) {
    if (this._authentication instanceof LocalAuthentication) {
      this._authentication.changePassword(updatedData.password);
      this._updatedFields.password = updatedData.password;
    } else {
      throw new Error(EntityErrorType.CannotSetPassword);
    }
  }

  this._updatedAt = new Date();
  this._updatedFields.updatedAt = this._updatedAt;
}

  /**
   * Create a new instance of User entity class based on the pre-existing 
   * user data in the repository
   * 
   * @static
   * @param {IUserInRequestDTO} data - The data from user repository.
   */
  static rehydrate(
    data : IUserInRequestDTO 
  ) : User {

    const isAdmin = data.role === UserRole.ADMIN;

    let authentication;

    if (data.authProvider === AuthProvider.LOCAL) {
      if (!data.password) {
        throw new Error(EntityErrorType.MissingPassword);
      }
      authentication = new LocalAuthentication(data.password);
    } else if (data.oAuthId) {
      authentication = new OAuthAuthentication(data.authProvider, data.oAuthId);
    } else {
      throw new Error(`${EntityErrorType.MissingOAuthId} ${data.authProvider}`);
    }

    return new User({
        userId: data.userId,
        username: data.username,
        email: new Email({ address: data.email }),
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        country: data.country,
        authentication,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        isArchived: false,
        
        // These values are specific based on role

        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
        preferredLanguage: isAdmin ? null : data.preferredLanguage ,
        easySolved: isAdmin ? null : data.easySolved,
        mediumSolved: isAdmin ? null : data.mediumSolved,
        hardSolved: isAdmin ? null : data.hardSolved,
        totalSubmission: isAdmin ? null : data.totalSubmission,
        streak: isAdmin ? null : data.streak
      });
  }

    /**
   * Serialize the user data to use in repository.
   * 
   * @returns {IUserInRequestDTO}
   */
  toObject() : IUserInRequestDTO {
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

  getUpdatedFields(): Partial<IUpdateUserRequestDTO> {
  return this._updatedFields;
  }

  private trackUpdate<K extends keyof IUpdateUserRequestDTO>(
    key: K,
    currentValue: IUpdateUserRequestDTO[K],
    newValue: IUpdateUserRequestDTO[K]
  ): boolean {
    if (newValue !== undefined && currentValue !== newValue) {
      this._updatedFields[key] = newValue;
      return true;
    }
    return false;
  }


  private constructor(props: IUserProps<T>) {
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

  get country(): string | null{
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
