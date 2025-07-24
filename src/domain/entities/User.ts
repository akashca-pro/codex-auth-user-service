import { ICreateUserRequestDTO } from '../dtos/User/CreateUser';
import { IUpdateUserRequestDTO } from '../dtos/User/UpdateUser';
import { UserRole } from '../enums/UserRole';
import { Email } from '../valueObjects/Email';
import {  UserAuthentication } from '../valueObjects/UserAuthentication';
import { BaseUser } from './BaseUser'
import { IBaseUserProps } from './BaseUser'
/**
 * Interface represents the additional props of a Regular user
 * It includes IBaseUserProps props.
 * 
 * @interface
 */
export interface IRegularUserProps <T extends UserAuthentication> extends IBaseUserProps<T>  {
  isArchived: boolean;
  preferredLanguage : string | null;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmission: number;
  streak: number;
}

/**
 * Class representing a regular user, extending BaseUser and providing full user details.
 * 
 * @class
 */
export class RegularUserEntity <T extends UserAuthentication> extends BaseUser <T> { 
  private readonly _isArchived: boolean;
  private readonly _preferredLanguage : string | null;
  private readonly _easySolved: number;
  private readonly _mediumSolved: number;
  private readonly _hardSolved: number;
  private readonly _totalSubmission: number;
  private readonly _streak: number;

  /**
   * Create a user instance based on the provided data
   * 
   * @param {IRegularUserProps} data - The provided data to create instance of a user
   * @returns {RegularUserEntity}
   */
  static create<T extends UserAuthentication>(
    data : ICreateUserRequestDTO & {authentication : T}) : RegularUserEntity<T> {
    const id = crypto.randomUUID();
    const now = new Date();

  return new RegularUserEntity({
    userId: id,
    username: data.username,
    email: new Email({ address: data.email }),
    firstName: data.firstName,
    lastName: data.lastName,
    avatar: data.avatar,
    country: data.country,
    authentication: data.authentication,
    role: UserRole.USER,
    createdAt: now,
    updatedAt: now,

    // Default values specific to regular users
    isArchived: false,
    preferredLanguage: 'js',
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSubmission: 0,
    streak: 0
  });
  }
  
  /**
   * Updates the user data instance with provided data
   * 
   * @param {IUpdateUserRequestDTO} updatedData - The data to be updated
   * @returns {IUpdateUserRequestDTO} - The updated data
   */
  static update(updatedData : IUpdateUserRequestDTO) : IUpdateUserRequestDTO {
    if(updatedData.email){
        updatedData.email = new Email({ address : updatedData.email }).address;
    }
    return updatedData
  }

  /**
   * @constructor
   * @param {IRegularUserProps} props 
   */
  private constructor(props: IRegularUserProps<T>) {
    super(props);

    this._isArchived = props.isArchived 
    this._preferredLanguage = props.preferredLanguage;
    this._easySolved = props.easySolved 
    this._mediumSolved = props.mediumSolved 
    this._hardSolved = props.hardSolved 
    this._totalSubmission = props.totalSubmission 
    this._streak = props.streak 
  }

  // Getters for RegularUserEntity specific properties
  get isArchived(): boolean {
    return this._isArchived;
  }

  get preferredLanguage(): string | null {
    return this._preferredLanguage;
  }

  get easySolved(): number  {
    return this._easySolved;
  }

  get mediumSolved(): number {
    return this._mediumSolved;
  }

  get hardSolved(): number {
    return this._hardSolved;
  }

  get totalSubmission(): number {
    return this._totalSubmission;
  }

  get streak(): number {
    return this._streak;
  }

}
