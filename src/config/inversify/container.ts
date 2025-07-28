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
import { IRefreshTokenEndPointUseCase } from '@/app/useCases/Authentication/RefreshTokenEndpoint';
import { RefreshTokenEndPointUseCase } from '@/app/useCases/Authentication/implementation/RefreshTokenEndPointUseCase';
import { IResendOtpUseCase } from '@/app/useCases/Authentication/ResendOtp';
import { ResendOtpUseCase } from '@/app/useCases/Authentication/implementation/ResendOtpUseCase';
import { VerifySignUpOtpUseCase } from '@/app/useCases/Authentication/implementation/VerifySignupOtpUseCase';
import { IVerifySignUpOtpUseCase } from '@/app/useCases/Authentication/VerifySignup';

// gRPC handlers
import { GrpcAuthHandler } from '@/infra/grpc/handlers/common/AuthHandler';
import { GrpcUserSignupHandler } from '@/infra/grpc/handlers/user/signupHandler';
import { GrpcUserVerifySignupOtpHandler } from '@/infra/grpc/handlers/user/VerifyOtpHandler';
import { GrpcUserResendOtpHandler } from '@/infra/grpc/handlers/user/ResendOtpHandler';
import { GrpcUserForgotPasswordHandler } from '@/infra/grpc/handlers/user/ForgotPasswordHandler';

const container = new Container();

/**
 * Adapters
 */
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IPasswordHasher>(TYPES.IPasswordHasher).to(BcryptPasswordHasher);
container.bind<ITokenProvider>(TYPES.ITokenProvider).to(JwtTokenProvider);
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService);

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
    .bind<IRefreshTokenEndPointUseCase>(TYPES.RefreshTokenEndpointUseCase)
    .to(RefreshTokenEndPointUseCase);
container
    .bind<IResendOtpUseCase>(TYPES.ResendOtpUseCase)
    .to(ResendOtpUseCase);
container
    .bind<IVerifySignUpOtpUseCase>(TYPES.VerifySignUpOtpUseCase)
    .to(VerifySignUpOtpUseCase);

/**
 * Common gRPC handlers.
 */
container
    .bind<GrpcAuthHandler>(TYPES.GrpcAuthHandler)
    .to(GrpcAuthHandler);

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
    .to(GrpcUserForgotPasswordHandler)

/**
 * Admin gRPC handlers.
 */


export default container;