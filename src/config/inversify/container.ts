import 'reflect-metadata'
import { Container } from "inversify";
import TYPES from './types';

// Dependencies
import { IUserRepository } from '@/domain/repository/User';
import { UserRepository } from '@/infra/repository/User';

import { IPasswordHasher } from '@/app/providers/PasswordHasher';
import { BcryptPasswordHasher } from '@/infra/providers/PasswordHasher';

import { ITokenProvider } from '@/app/providers/GenerateTokens';
import { JwtTokenProvider } from '@/infra/providers/TokenProvider';

import { IOtpService } from '@/app/providers/GenerateAndSendOtp';
import { OtpService } from '@/infra/providers/OtpService';

// Use cases
import { IAuthenticateLocalAuthUserUseCase } from '@/app/useCases/Authentication/AuthenticateLocalAuthUser';
import { AuthenticateLocalUserUseCase } from '@/app/useCases/Authentication/implementation/AuthenticateLocalUser';
import { IAuthenticateOAuthUserUseCase } from '@/app/useCases/Authentication/AuthenticateOAuthUser';
import { AuthenticateOAuthUserUseCase } from '@/app/useCases/Authentication/implementation/AuthenticateOAuthUser';
import { IForgotPasswordUseCase } from '@/app/useCases/Authentication/ForgotPasswordUseCase';
import { ForgotpasswordUseCase } from '@/app/useCases/Authentication/implementation/ForgotPasswordUseCase';
import { IResetPasswordUseCase } from '@/app/useCases/Authentication/ResetPasswordUseCase';
import { ResetPasswordUseCase } from '@/app/useCases/Authentication/implementation/ResetPasswordUseCase';
import { IRefreshTokenUseCase } from '@/app/useCases/Authentication/RefreshTokenUseCase';
import { RefreshTokenUseCase } from '@/app/useCases/Authentication/implementation/RefreshTokenUseCase';
import { IResendOtpUseCase } from '@/app/useCases/Authentication/ResendOtp';
import { ResendOtpUseCase } from '@/app/useCases/Authentication/implementation/ResendOtpUseCase';
import { VerifySignUpOtpUseCase } from '@/app/useCases/Authentication/implementation/VerifySignupOtpUseCase';
import { IVerifySignUpOtpUseCase } from '@/app/useCases/Authentication/VerifySignup';

// gRPC handlers
import { GrpcUserAuthHandler } from '@/presentation/grpc/handlers/user/UserAuthHandler';
import { GrpcUserSignupHandler } from '@/presentation/grpc/handlers/user/SignupHandler';
import { GrpcUserVerifySignupOtpHandler } from '@/presentation/grpc/handlers/user/VerifySignupOtpHandler';
import { GrpcUserResendOtpHandler } from '@/presentation/grpc/handlers/user/ResendOtpHandler';
import { GrpcUserForgotPasswordHandler } from '@/presentation/grpc/handlers/user/ForgotPasswordHandler';
import { GrpcUserResetPasswordHandler } from '@/presentation/grpc/handlers/user/ResetPasswordHandler';
import { GrpcOAuthHandler } from '@/presentation/grpc/handlers/user/OAuthHandler';
import { GrpcRefreshTokenHandler } from '@/presentation/grpc/handlers/common/RefreshTokenHandler';
import { GrpcProfileHandler } from '@/presentation/grpc/handlers/user/ProfileHandler';

import Redis from 'ioredis';
import redis from '@/config/redis'
import { mailer } from "@/config/mailer";
import logger from '@/utils/logger';
import { Logger } from 'winston';
import { PrismaClient } from '@/generated/prisma';
import { ISignUpUserUseCase } from '@/app/useCases/User/SignupUserUseCase.interface';
import { SignupUserUseCase } from '@/app/useCases/User/implementation/SignupUserUseCase';
import { IProfileUseCase } from '@/app/useCases/User/ProfileUserUseCase.interface';
import { ProfileUseCase } from '@/app/useCases/User/implementation/ProfileUserUseCase';
import { GrpcAdminAuthHandler } from '@/presentation/grpc/handlers/admin/AdminAuthHandler';
import { IUpdateUserProfileUseCase } from '@/app/useCases/User/UpdateProfileUseCase.interface';
import { UpdateUserProfileUseCase } from '@/app/useCases/User/implementation/UpdateProfileUseCase';
import { GrpcUpdateProfileHandler } from '@/presentation/grpc/handlers/common/UpdateProfileHandler';
import { ICacheProvider } from '@/app/providers/CacheProvider';
import { RedisCacheProvider } from '@/infra/providers/RedisCacheProvider';
import { IListUsersUseCase } from '@/app/useCases/admin/listUsers.usecase.interface';
import { ListUsersUseCase } from '@/app/useCases/admin/implementation/listUsers.usecase';
import { GrpcAdminListUsersHandler } from '@/presentation/grpc/handlers/admin/ListUsersHandler';
import { IToggleBlockUserUseCase } from '@/app/useCases/admin/toggleBlockUser.usecase.interface';
import { ToggleBlockUserUseCase } from '@/app/useCases/admin/implementation/toggleBlockUser.usecase';
import { GrpcToggleBlockUserHandler } from '@/presentation/grpc/handlers/admin/ToggleBlockUserHandler';
import { GrpcAdminProfileHandler } from '@/presentation/grpc/handlers/admin/ProfileHandler';
import { IChangePassUseCase } from '@/app/useCases/User/ChangePass.usecase.interface';
import { ChangePassUseCase } from '@/app/useCases/User/implementation/ChangePass.usecase';
import { GrpcChangePassHandler } from '@/presentation/grpc/handlers/user/ChangePassHandler';
import { IChangeEmailUseCase } from '@/app/useCases/User/ChangeEmail.usecase.interface';
import { ChangeEmailUseCase } from '@/app/useCases/User/implementation/ChangeEmail.usecase';
import { GrpcChangeEmailHandler } from '@/presentation/grpc/handlers/user/ChangeEmailHandler';
import { IVerifyNewEmailUseCase } from '@/app/useCases/User/VerifyNewEmail.usecase.interface';
import { VerifyNewEmailUseCase } from '@/app/useCases/User/implementation/VerifyNewEmail.usecase';
import { GrpcVerifyNewEmailHandler } from '@/presentation/grpc/handlers/user/VerifyEmailHandler';
import { IDeleteAccountUseCase } from '@/app/useCases/User/DeleteAccount.usecase.interface';
import { DeleteAccountUseCase } from '@/app/useCases/User/implementation/DeleteAccount.usecase';
import { GrpcDeleteAccountHandler } from '@/presentation/grpc/handlers/user/DeleteAccountHandler';
import { IUserStatUseCase } from '@/app/useCases/admin/userStat.usecase.interface';
import { UserStatsUseCase } from '@/app/useCases/admin/implementation/userStat.usecase';
import { GrpcAdminUserStats } from '@/presentation/grpc/handlers/admin/UserStatsHandler';

const container = new Container();

container.bind<Redis>(TYPES.Redis).toConstantValue(redis);
container.bind<typeof mailer>(TYPES.Mailer).toConstantValue(mailer);
container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

// Bind providers
container.bind<IOtpService>(TYPES.IOtpService).toDynamicValue(() => {
    return new OtpService(redis, mailer, logger);
}).inSingletonScope();

/**
 * Adapters
 */
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IPasswordHasher>(TYPES.IPasswordHasher).to(BcryptPasswordHasher).inSingletonScope();
container.bind<ITokenProvider>(TYPES.ITokenProvider).to(JwtTokenProvider).inSingletonScope();
container.bind<ICacheProvider>(TYPES.ICacheProvider).to(RedisCacheProvider).inSingletonScope();

/**
 * UseCases
 */
container
    .bind<IAuthenticateLocalAuthUserUseCase>(TYPES.AuthenticateLocalUserUseCase)
    .to(AuthenticateLocalUserUseCase).inSingletonScope();
container
    .bind<IAuthenticateOAuthUserUseCase>(TYPES.AuthenticateOAuthUserUseCase)
    .to(AuthenticateOAuthUserUseCase).inSingletonScope();
container
    .bind<IForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase)
    .to(ForgotpasswordUseCase).inSingletonScope();
container
    .bind<IResetPasswordUseCase>(TYPES.ResetPasswordUseCase)
    .to(ResetPasswordUseCase).inSingletonScope();
container
    .bind<IRefreshTokenUseCase>(TYPES.RefreshTokenUseCase)
    .to(RefreshTokenUseCase).inSingletonScope();
container
    .bind<IResendOtpUseCase>(TYPES.ResendOtpUseCase)
    .to(ResendOtpUseCase).inSingletonScope();
container
    .bind<IVerifySignUpOtpUseCase>(TYPES.VerifySignUpOtpUseCase)
    .to(VerifySignUpOtpUseCase).inSingletonScope();
container
    .bind<ISignUpUserUseCase>(TYPES.SignUpUserUseCase)
    .to(SignupUserUseCase).inSingletonScope();
container
    .bind<IProfileUseCase>(TYPES.ProfileUseCase)
    .to(ProfileUseCase).inSingletonScope();
container
    .bind<IUpdateUserProfileUseCase>(TYPES.UpdateProfileUseCase)
    .to(UpdateUserProfileUseCase).inSingletonScope();
container
    .bind<IListUsersUseCase>(TYPES.ListUsersUseCase)
    .to(ListUsersUseCase).inSingletonScope();
container
    .bind<IToggleBlockUserUseCase>(TYPES.ToggleBlockUserUseCase)
    .to(ToggleBlockUserUseCase).inSingletonScope();
container
    .bind<IChangePassUseCase>(TYPES.ChangePassUseCase)
    .to(ChangePassUseCase).inSingletonScope();
container
    .bind<IChangeEmailUseCase>(TYPES.ChangeEmailUseCase)
    .to(ChangeEmailUseCase).inSingletonScope();
container
    .bind<IVerifyNewEmailUseCase>(TYPES.VerifyNewEmailUseCase)
    .to(VerifyNewEmailUseCase).inSingletonScope();
container
    .bind<IDeleteAccountUseCase>(TYPES.DeleteAccountUseCase)
    .to(DeleteAccountUseCase).inSingletonScope();
container
    .bind<IUserStatUseCase>(TYPES.UserStatsUseCase)
    .to(UserStatsUseCase).inSingletonScope()

/**
 * Common gRPC handlers.
 */
container
    .bind<GrpcUserAuthHandler>(TYPES.GrpcUserAuthHandler)
    .to(GrpcUserAuthHandler).inSingletonScope();
container
    .bind<GrpcOAuthHandler>(TYPES.GrpcOAuthHandler)
    .to(GrpcOAuthHandler).inSingletonScope();
container
    .bind<GrpcRefreshTokenHandler>(TYPES.GrpcRefreshTokenHandler)
    .to(GrpcRefreshTokenHandler).inSingletonScope();
container
    .bind<GrpcUpdateProfileHandler>(TYPES.GrpcUpdateProfileHandler)
    .to(GrpcUpdateProfileHandler).inSingletonScope();

/**
 * User gRPC handlers.
 */
container
    .bind<GrpcUserSignupHandler>(TYPES.GrpcUserSignupHandler)
    .to(GrpcUserSignupHandler).inSingletonScope();
container
    .bind<GrpcUserVerifySignupOtpHandler>(TYPES.GrpcUserVerifySignupOtpHandler)
    .to(GrpcUserVerifySignupOtpHandler).inSingletonScope();
container
    .bind<GrpcUserResendOtpHandler>(TYPES.GrpcUserResendOtpHandler)
    .to(GrpcUserResendOtpHandler).inSingletonScope();
container   
    .bind<GrpcUserForgotPasswordHandler>(TYPES.GrpcUserForgotPasswordHandler)
    .to(GrpcUserForgotPasswordHandler).inSingletonScope();
container
    .bind<GrpcUserResetPasswordHandler>(TYPES.GrpcUserResetPasswordHandler)
    .to(GrpcUserResetPasswordHandler).inSingletonScope();
container
    .bind<GrpcProfileHandler>(TYPES.GrpcProfileHandler)
    .to(GrpcProfileHandler).inSingletonScope();
container
    .bind<GrpcChangePassHandler>(TYPES.GrpcChangePassHandler)
    .to(GrpcChangePassHandler).inSingletonScope();
container
    .bind<GrpcChangeEmailHandler>(TYPES.GrpcChangeEmailHandler)
    .to(GrpcChangeEmailHandler).inSingletonScope();
container
    .bind<GrpcVerifyNewEmailHandler>(TYPES.GrpcVerifyNewEmailHandler)
    .to(GrpcVerifyNewEmailHandler).inSingletonScope();
container
    .bind<GrpcDeleteAccountHandler>(TYPES.GrpcDeleteAccountHandler)
    .to(GrpcDeleteAccountHandler).inSingletonScope();

/**
 * Admin gRPC handlers.
 */
container
    .bind<GrpcAdminProfileHandler>(TYPES.GrpcAdminProfileHandler)
    .to(GrpcAdminProfileHandler).inSingletonScope();

container
    .bind<GrpcAdminAuthHandler>(TYPES.GrpcAdminAuthHandler)
    .to(GrpcAdminAuthHandler).inSingletonScope();
container
    .bind<GrpcAdminListUsersHandler>(TYPES.GrpcAdminListUsersHandler)
    .to(GrpcAdminListUsersHandler).inSingletonScope();
container
    .bind<GrpcToggleBlockUserHandler>(TYPES.GrpcToggleBlockUserHandler)
    .to(GrpcToggleBlockUserHandler).inSingletonScope();
container
    .bind<GrpcAdminUserStats>(TYPES.GrpcAdminUserStats)
    .to(GrpcAdminUserStats).inSingletonScope();


export default container;