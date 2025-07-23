import { AuthProvider } from '../enums/AuthProvider'
import { Email } from '../valueObjects/Email'
import { BaseUser, IBaseUserProps } from './BaseUser'

/**
 * Interface representing the structure of a regular user.
 * It extends IBaseUserProps and adds specific properties for a RegularUser.
 */
export interface IRegularUserProps extends IBaseUserProps {
    isVerified: boolean;
    isArchived: boolean;
    preferredLanguage?: string;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmission: number;
    streak: number;
}

/**
 * Class representing a regular user, extending BaseUser and providing full user details.
 */
export class RegularUserEntity extends BaseUser { 
  private readonly _isVerified: boolean;
  private readonly _isArchived: boolean;
  private readonly _preferredLanguage?: string;
  private readonly _easySolved: number;
  private readonly _mediumSolved: number;
  private readonly _hardSolved: number;
  private readonly _totalSubmission: number;
  private readonly _streak: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;


  constructor(props: IRegularUserProps) {
    // Pass properties belonging to BaseUser directly to the super constructor
    super(
      props.userId,
      props.username,
      props.email,
      props.role,
      props.firstName,
      props.country,
      props.authProvider,
      props.createdAt,
      props.updatedAt,
      props.avatar,
      props.lastName,
      props.oAuthId,
      props.password,
    );

    // Assign properties specific to RegularUserEntity
    this._isVerified = props.isVerified ?? false;
    this._isArchived = props.isArchived ?? false;
    this._preferredLanguage = props.preferredLanguage;
    this._easySolved = props.easySolved ?? 0;
    this._mediumSolved = props.mediumSolved ?? 0;
    this._hardSolved = props.hardSolved ?? 0;
    this._totalSubmission = props.totalSubmission ?? 0;
    this._streak = props.streak ?? 0;
  }

  // Getters for RegularUserEntity specific properties
  get isVerified(): boolean {
    return this._isVerified;
  }

  get isArchived(): boolean {
    return this._isArchived;
  }

  get preferredLanguage(): string | undefined {
    return this._preferredLanguage;
  }

  get easySolved(): number {
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