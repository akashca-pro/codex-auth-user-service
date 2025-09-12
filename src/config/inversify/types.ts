const TYPES = {
  IUserRepository: Symbol.for("IUserRepository"),
  IPasswordHasher: Symbol.for("IPasswordHasher"),
  ITokenProvider: Symbol.for("ITokenProvider"),
  IOtpService: Symbol.for("IOtpService"),
  ICacheProvider : Symbol.for("ICacheProvider"),

  Redis : Symbol.for("Redis"),
  Mailer : Symbol.for("Mailer"),
  Logger : Symbol.for("Logger"),
  PrismaClient : Symbol.for("PrismaClient"),

  //Use cases

  AuthenticateLocalUserUseCase: Symbol.for("AuthenticateLocalUserUseCase"),
  AuthenticateOAuthUserUseCase : Symbol.for("AuthenticateOAuthUserUseCase"),
  ForgotPasswordUseCase : Symbol.for("ForgotPasswordUseCase"),
  ResetPasswordUseCase : Symbol.for("ResetPasswordUseCase"),
  RefreshTokenUseCase : Symbol.for("RefreshTokenUseCase"),
  ResendOtpUseCase : Symbol.for("ResendOtpUseCase"),
  VerifySignUpOtpUseCase : Symbol.for("VerifySignUpOtpUseCase"),
  ProfileUseCase : Symbol.for("ProfileUseCase"),
  SignUpUserUseCase : Symbol.for("SignUpUserUseCase"),
  UpdateProfileUseCase : Symbol.for("UpdateProfileUseCase"),
  ListUsersUseCase : Symbol.for("ListUsersUseCase"),
  ToggleBlockUserUseCase : Symbol.for("ToggleBlockUserUseCase"),
  ChangePassUseCase : Symbol.for("ChangePassUseCase"),
  ChangeEmailUseCase : Symbol.for("ChangeEmailUseCase"),
  VerifyNewEmailUseCase : Symbol.for("VerifyNewEmailUseCase"),
  DeleteAccountUseCase : Symbol.for("DeleteAccountUseCase"),

  // User handler

  GrpcUserAuthHandler : Symbol.for("GrpcUserAuthHandler"),
  GrpcUserSignupHandler : Symbol.for("GrpcUserSignupHandler"),
  GrpcUserVerifySignupOtpHandler : Symbol.for("GrpcUserVerifySignupOtpHandler"),
  GrpcUserResendOtpHandler : Symbol.for("GrpcUserResendOtpHandler"),
  GrpcUserForgotPasswordHandler : Symbol.for("GrpcUserForgotPasswordHandler"),
  GrpcUserResetPasswordHandler : Symbol.for("GrpcUserResetPasswordHandler"),
  GrpcOAuthHandler : Symbol.for("GrpcOAuthHandler"),
  GrpcRefreshTokenHandler : Symbol.for("GrpcRefreshTokenHandler"),
  GrpcProfileHandler : Symbol.for("GrpcProfileHandler"),
  GrpcChangePassHandler : Symbol.for("GrpcChangePassHandler"),
  GrpcChangeEmailHandler : Symbol.for("GrpcChangeEmailHandler"),
  GrpcVerifyNewEmailHandler : Symbol.for("GrpcVerifyNewEmailHandler"),
  GrpcDeleteAccountHandler : Symbol.for("GrpcDeleteAccountHandler"),
  

  // Admin handlers

  GrpcAdminAuthHandler : Symbol.for("GrpcAdminAuthHandler"),
  GrpcAdminListUsersHandler : Symbol.for("GrpcAdminListUsersHandler"),
  GrpcToggleBlockUserHandler : Symbol.for("GrpcToggleBlockUserHandler"),
  GrpcAdminProfileHandler : Symbol.for("GrpcAdminProfileHandler"),

  // Common handlers

  GrpcUpdateProfileHandler : Symbol.for("GrpcUpdateProfileHandler"),

};

export default TYPES;