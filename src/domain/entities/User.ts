import { ICreateUserRequestDTO } from '../dtos/User/CreateUser'
import { IUpdateUserRequestDTO } from '../dtos/User/UpdateUser'
import { AuthProvider } from '../enums/AuthProvider'
import { UserRole } from '../enums/UserRole'
import { Email } from '../valueObjects/Email'


/**
 * Interface representing the structure of a user.
 *
 * @interface
 */
export interface UserInterface {
  username: string
  email: Email
  password?: string
  googleId? : string
  firstName: string
  lastName?: string
  avatar?: string
  country: string
  preferredLanguage?: string
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSubmission: number
  streak: number
}


/**
 * Class representing a user.
 * 
 * @class
 */
export class UserEntity {
    private _props : UserInterface

    /**
     * Create a new user instance based on the provided data.
     * 
     * @static
     * @param {ICreateUserRequestDTO} data - The data to create a user.
     * @returns {UserEntity} The created user instance.
     */
  static create(data: ICreateUserRequestDTO) : UserEntity {
    const emailVO = new Email({ address: data.email })

    const newUser: UserInterface = {
      username: data.username,
      email: emailVO,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      country: data.country,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalSubmission: 0,
      streak: 0,
    }

    return new UserEntity(newUser)
  }

}