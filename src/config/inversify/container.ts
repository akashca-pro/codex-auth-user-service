import 'reflect-metadata'
import { Container } from "inversify";
import TYPES from './types';

// Dependencies
import { IUserRepository } from '@/app/repository/User';
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
import { GrpcAuthHandler } from '@/presentation/grpc/handlers/common/AuthHandler';
import { GrpcUserSignupHandler } from '@/presentation/grpc/handlers/user/SignupHandler';
import { GrpcUserVerifySignupOtpHandler } from '@/presentation/grpc/handlers/user/VerifyOtpHandler';
import { GrpcUserResendOtpHandler } from '@/presentation/grpc/handlers/user/ResendOtpHandler';
import { GrpcUserForgotPasswordHandler } from '@/presentation/grpc/handlers/user/ForgotPasswordHandler';
import { GrpcUserResetPasswordHandler } from '@/presentation/grpc/handlers/user/ResetPasswordHandler';
import { GrpcOAuthHandler } from '@/presentation/grpc/handlers/common/OAuthHandler';
import { GrpcRefreshTokenHandler } from '@/presentation/grpc/handlers/common/RefreshTokenHandler';
import { GrpcProfileHandler } from '@/presentation/grpc/handlers/common/ProfileHandler';

import Redis from 'ioredis';
import redis from '@/config/redis'
import { mailer } from "@/config/mailer";
import logger from '@/utils/logger';
import { Logger } from 'winston';
import { PrismaClient } from '@/generated/prisma';
import { ISignUpUserUseCase } from '@/app/useCases/User/SignupUserUseCase';
import { SignupUserUseCase } from '@/app/useCases/User/implementation/SignupUserUseCase';
import { IProfileUseCase } from '@/app/useCases/User/ProfileUserUseCase';
import { ProfileUseCase } from '@/app/useCases/User/implementation/ProfileUserUseCase';

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
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IPasswordHasher>(TYPES.IPasswordHasher).to(BcryptPasswordHasher);
container.bind<ITokenProvider>(TYPES.ITokenProvider).to(JwtTokenProvider);

/**
 * UseCases
 */
container
    .bind<IAuthenticateLocalAuthUserUseCase>(TYPES.AuthenticateLocalUserUseCase)
    .to(AuthenticateLocalUserUseCase);
container
    .bind<IAuthenticateOAuthUserUseCase>(TYPES.AuthenticateOAuthUserUseCase)
    .to(AuthenticateOAuthUserUseCase);
container
    .bind<IForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase)
    .to(ForgotpasswordUseCase);
container
    .bind<IResetPasswordUseCase>(TYPES.ResetPasswordUseCase)
    .to(ResetPasswordUseCase);
container
    .bind<IRefreshTokenUseCase>(TYPES.RefreshTokenUseCase)
    .to(RefreshTokenUseCase);
container
    .bind<IResendOtpUseCase>(TYPES.ResendOtpUseCase)
    .to(ResendOtpUseCase);
container
    .bind<IVerifySignUpOtpUseCase>(TYPES.VerifySignUpOtpUseCase)
    .to(VerifySignUpOtpUseCase);
container
    .bind<ISignUpUserUseCase>(TYPES.SignUpUserUseCase)
    .to(SignupUserUseCase);
container
    .bind<IProfileUseCase>(TYPES.ProfileUseCase)
    .to(ProfileUseCase)

/**
 * Common gRPC handlers.
 */
container
    .bind<GrpcAuthHandler>(TYPES.GrpcAuthHandler)
    .to(GrpcAuthHandler);
container
    .bind<GrpcOAuthHandler>(TYPES.GrpcOAuthHandler)
    .to(GrpcOAuthHandler);
container
    .bind<GrpcRefreshTokenHandler>(TYPES.GrpcRefreshTokenHandler)
    .to(GrpcRefreshTokenHandler);

/**
 * User gRPC handlers.
 */
container
    .bind<GrpcUserSignupHandler>(TYPES.GrpcUserSignupHandler)
    .to(GrpcUserSignupHandler);
container
    .bind<GrpcUserVerifySignupOtpHandler>(TYPES.GrpcUserVerifySignupOtpHandler)
    .to(GrpcUserVerifySignupOtpHandler);
container
    .bind<GrpcUserResendOtpHandler>(TYPES.GrpcUserResendOtpHandler)
    .to(GrpcUserResendOtpHandler);
container   
    .bind<GrpcUserForgotPasswordHandler>(TYPES.GrpcUserForgotPasswordHandler)
    .to(GrpcUserForgotPasswordHandler);
container
    .bind<GrpcUserResetPasswordHandler>(TYPES.GrpcUserResetPasswordHandler)
    .to(GrpcUserResetPasswordHandler);
container
    .bind<GrpcProfileHandler>(TYPES.GrpcProfileHandler)
    .to(GrpcProfileHandler);

/**
 * Admin gRPC handlers.
 */

export default container;