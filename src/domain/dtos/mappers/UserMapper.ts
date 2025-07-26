import { LocalAuthentication, OAuthAuthentication } from "@/domain/valueObjects/UserAuthentication";
import { ICreateUserRequestDTO } from "../User/CreateUser";
import { IUserInRequestDTO } from "../User/UserIn";
import { IUserOutRequestDTO } from "../User/UserOut";
import { UserRole } from "@/domain/enums/UserRole";
import { AuthProvider } from "@/domain/enums/AuthProvider"; 
import { User as PrismaUser } from '@/generated/prisma'
import { CreateAdminUserRequestDTO, CreateLocalAuthUserRequestDTO, CreateOAuthUserRequestDTO } from "@/utils/dto/CreateUser";

export class UserMapper {

  static toCreateLocalAuthUserDTO(
    body : CreateLocalAuthUserRequestDTO
) : ICreateUserRequestDTO {

    return {
        username : body.username,
        authentication : new LocalAuthentication(body.password),
        avatar : body.avatar ?? null,
        country : body.country,
        email : body.email,
        firstName : body.firstName,
        lastName : body.lastName ?? null,
        role : UserRole.USER
    }

  }

  static toCreateOAuthUser(
    body : CreateOAuthUserRequestDTO)
     : ICreateUserRequestDTO {

    return {
        username : body.username,
        authentication : new OAuthAuthentication(AuthProvider.GOOGLE,
            body.oAuthId
        ),
        avatar : body.avatar ?? null,
        country : body.country,
        email : body.email,
        firstName : body.firstName,
        lastName : body.lastName ?? null,
        role : UserRole.USER
    }

  }

  static toCreateAdminUserDTO(
    body : CreateAdminUserRequestDTO) 
  : ICreateUserRequestDTO {

    return {
        username : body.username,
        authentication : new LocalAuthentication(body.password),
        avatar : body.avatar ?? null,
        country : body.country,
        email : body.email,
        firstName : body.firstName,
        lastName : body.lastName ?? null,
        role : UserRole.ADMIN
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
      easySolved: user.easySolved,
      mediumSolved: user.mediumSolved,
      hardSolved: user.hardSolved,
      totalSubmission: user.totalSubmission,
      streak: user.streak,
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
}