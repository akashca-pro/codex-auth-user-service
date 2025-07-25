import { IUserInRequestDTO } from "../User/UserIn";
import { IUserOutRequestDTO } from "../User/UserOut";

export class UserMapper {
  static toOutDTO(user: IUserInRequestDTO) : IUserOutRequestDTO {
    return {
      userId: user.userId,
      username: user.username,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      country: user.country,
      preferredLanguage: user.preferredLanguage,
      easySolved: user.easySolved,
      mediumSolved: user.mediumSolved,
      hardSolved: user.hardSolved,
      totalSubmission: user.totalSubmission,
      streak: user.streak,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}