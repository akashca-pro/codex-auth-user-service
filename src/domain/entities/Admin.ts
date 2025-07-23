import { AuthProvider } from "../enums/AuthProvider";
import { UserRole } from "../enums/UserRole";
import { Email } from "../valueObjects/Email";
import { BaseUser } from "./BaseUser";
import { IBaseUserProps } from './BaseUser'

/**
 * Class representing an admin user, extending BaseUser and providing full user details.
 * 
 * @class
 * @param {IBaseUserProps}
 * @returns {AdminUserEntity}
 */
export class AdminUserEntity extends BaseUser {
  static create(props: IBaseUserProps): AdminUserEntity {
    if (props.authProvider === AuthProvider.LOCAL && !props.password) {
      throw new Error("Password is required for Local auth provider");
    }
    if (props.authProvider !== AuthProvider.LOCAL && !props.oAuthId) {
      throw new Error(`oAuthId is required for ${props.authProvider} provider`);
    }

    return new AdminUserEntity(props);
  }

  private constructor(props: IBaseUserProps) {
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
      props.password
    );
  }
}

const admin = AdminUserEntity.create({
      userId : 'sdf',
      username : '',
      email : new Email({address : 'email'}),
      role : UserRole.ADMIN,
      firstName : '',
      country : '',
      authProvider : AuthProvider.LOCAL,
      createdAt : new Date(),
      updatedAt : new Date(),
      avatar : '',
      lastName : '',
      password : ''
})
