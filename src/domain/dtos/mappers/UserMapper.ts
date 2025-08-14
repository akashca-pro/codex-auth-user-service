import { ICreateLocalUserRequestDTO, ICreateOAuthUserRequestDTO } from "../User/CreateUser";
import { IUserInRequestDTO } from "../User/UserIn";
import { IUserOutRequestDTO } from "../User/UserOut";
import { UserRole } from "@/domain/enums/UserRole";
import { AuthProvider } from "@/domain/enums/AuthProvider"; 
import { User as PrismaUser } from '@/generated/prisma'
import { CreateLocalAuthUserRequestDTO, CreateOAuthUserRequestDTO } from "@/utils/dto/CreateUser";
import { isValidCountry } from "@/utils/countryCheck";
import { UserErrorType } from "@/domain/enums/user/ErrorType";

export class UserMapper {

  static toCreateLocalAuthUserDTO(
    body : CreateLocalAuthUserRequestDTO,
    role : UserRole
) : ICreateLocalUserRequestDTO {

    if(!isValidCountry(body.country)) 
      throw new Error(UserErrorType.InvalidCountryCode)

    return {
        username : body.username,
        password : body.password,
        avatar : body.avatar ?? null,
        country : body.country,
        email : body.email,
        firstName : body.firstName,
        lastName : body.lastName ?? null,
        role
    }

  }

  static toCreateOAuthUserDTO(
    body : CreateOAuthUserRequestDTO,
    role : UserRole
  ) : ICreateOAuthUserRequestDTO {

    return {
        oAuthId : body.oAuthId,
        avatar : body.avatar ?? null,
        email : body.email,
        firstName : body.firstName,
        role
    }

  }

  static toOutDTO(user: IUserInRequestDTO) : IUserOutRequestDTO {
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      country: user.country,
      preferredLanguage: user.preferredLanguage,
      easySolved: user.easySolved ?? 0,
      mediumSolved: user.mediumSolved ?? 0,
      hardSolved: user.hardSolved ?? 0,
      totalSubmission: user.totalSubmission ?? 0,
      streak: user.streak ?? 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static mapPrismaUserToDomain(user : PrismaUser) : IUserInRequestDTO {
  return {
      userId: user.userId,
      role: user.role as UserRole,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      authProvider: user.authProvider as AuthProvider,
      password: user.password,
      oAuthId: user.oAuthId,
      country: user.country,
      isVerified: user.isVerified,
      isArchived: user.isArchived,
      preferredLanguage: user.preferredLanguage,
      easySolved: user.easySolved,
      mediumSolved: user.mediumSolved,
      hardSolved: user.hardSolved,
      totalSubmission: user.totalSubmission,
      streak: user.streak,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

static toUserRole(role: string): UserRole {
  const normalized = role?.toLowerCase();

  if (normalized === 'user') {
    return UserRole.USER;
  }

  if (normalized === 'admin') {
    return UserRole.ADMIN;
  }

  throw new Error('Invalid role: ' + role);
}

}