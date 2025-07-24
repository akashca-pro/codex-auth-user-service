import { IUpdateUserRequestDTO } from "../dtos/User/UpdateUser";
import { UserAuthentication } from "../valueObjects/UserAuthentication";
import { BaseUser } from "./BaseUser";
import { IBaseUserProps } from './BaseUser'

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
   * @param {IBaseUserProps} data
   * @returns {AdminUserEntity}
   */
  static create<T extends UserAuthentication>(data: IBaseUserProps<T>): AdminUserEntity<T> {

    return new AdminUserEntity(data);
  }

//   /**
//    * 
//    * @param {IUpdateUserRequestDTO} data - The data to update a user
//    */
//   static update(data : IUpdateUserRequestDTO) : IUpdateUserRequestDTO {

//   }

  private constructor(props: IBaseUserProps<T>) {
    super(props);
  }
}

