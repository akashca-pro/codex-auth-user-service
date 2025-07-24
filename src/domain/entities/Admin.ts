import { ICreateUserRequestDTO } from "../dtos/User/CreateUser";
import { IUpdateUserRequestDTO } from "../dtos/User/UpdateUser";
import { AuthProvider } from "../enums/AuthProvider";
import { UserRole } from "../enums/UserRole";
import { Email } from "../valueObjects/Email";
import { LocalAuthentication, OAuthAuthentication, UserAuthentication } from "../valueObjects/UserAuthentication";
import { BaseUser } from "./BaseUser";
import { IBaseUserProps } from './BaseUser'

/**
 * Data Tranfer Object (DTO) representing the full output shape of an Admin User,
 * suitable for returning to the application layer or persistence.
 * 
 * @interface
 */
export interface IAdminUserOutDTO {
  userId: string;
  username: string;
  firstName: string;
  lastName: string | null;
  avatar : string | null;
  email: string;
  country: string;
  role: UserRole;
  authProvider: AuthProvider;
  isVerified: boolean;
  password : string | null;     
  oAuthId : string | null;       
  createdAt: Date;
  updatedAt: Date;
}


/**
 * Class representing an admin user, extending BaseUser and providing full user details.
 * 
 * @class
 */
export class AdminUserEntity<T extends UserAuthentication > extends BaseUser<T> {

  /**
   * Create a new admin user instance based on provided data
   * 
   * @static
   * @param {ICreateUserRequestDTO} data - The data for creating an admin from use case.
   * @returns {AdminUserEntity} - The data represents new admin instance.
   */
  static create<T extends UserAuthentication>(
    data: ICreateUserRequestDTO & {authentication : T}): IAdminUserOutDTO {
    const id = crypto.randomUUID();
    const now = new Date();

      const instance = new AdminUserEntity({
      userId : id,
      username : data.username,
      email : new Email({address : data.email}),
      firstName : data.firstName,
      lastName : data.lastName,
      avatar : data.avatar,
      country : data.country,
      authentication : data.authentication,
      role : UserRole.ADMIN,
      createdAt : now,
      updatedAt : now,
    });

    return instance.toObject();
  }
  /**
   * Updates the user data instance with provided data.
   * 
   * @param {IUpdateUserRequestDTO} updatedData - The data to update an admin user.
   * @returns {IUpdateUserRequestDTO} - The updated data of the admin user
   */
  static update(updatedData : IUpdateUserRequestDTO) : IUpdateUserRequestDTO {
    if(updatedData.email){
        updatedData.email = new Email({ address : updatedData.email }).address;
    }
    return updatedData
  }

  toObject() : IAdminUserOutDTO {
    const auth = this.authentication;
    return {
      userId : this.userId,
      username : this.username,
      email : this.email.address,
      firstName : this.firstName,
      lastName : this.lastName,
      avatar : this.avatar,
      country : this.country,
      role : this.role,
      isVerified : auth.isVerified,
      authProvider : auth.authProvider,
      password : auth instanceof LocalAuthentication ? auth.password : null,
      oAuthId : auth instanceof OAuthAuthentication ? auth.oAuthId : null,
      createdAt : this.createdAt,
      updatedAt : this.updatedAt
    }
  }

  private constructor(props: IBaseUserProps<T>) {
    super(props);
  }
}


