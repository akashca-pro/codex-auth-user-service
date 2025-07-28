const TYPES = {
  IUserRepository: Symbol.for("IUserRepository"),
  IPasswordHasher: Symbol.for("IPasswordHasher"),
  ITokenProvider: Symbol.for("ITokenProvider"),
  IOtpService: Symbol.for("IOtpService"),

  Redis : Symbol.for("Redis"),
  Mailer : Symbol.for("Mailer"),
  Logger : Symbol.for("Logger"),

  AuthenticateLocalUserUseCase: Symbol.for("AuthenticateLocalUserUseCase"),
  AuthenticateOAuthUserUseCase : Symbol.for("AuthenticateOAuthUserUseCase"),
  ForgotPasswordUseCase : Symbol.for("ForgotPasswordUseCase"),
  ResetPasswordUseCase : Symbol.for("ResetPasswordUseCase"),
  RefreshTokenUseCase : Symbol.for("RefreshTokenUseCase"),
  ResendOtpUseCase : Symbol.for("ResendOtpUseCase"),
  VerifySignUpOtpUseCase : Symbol.for("VerifySignUpOtpUseCase"),
  ProfileUserUseCase : Symbol.for("ProfileUserUseCase"),
  SignUpUserUseCase : Symbol.for("SignUpUserUseCase"),

  GrpcAuthHandler : Symbol.for("GrpcAuthHandler"),
  
  GrpcUserSignupHandler : Symbol.for("GrpcUserSignupHandler"),
  GrpcUserVerifySignupOtpHandler : Symbol.for("GrpcUserVerifySignupOtpHandler"),
  GrpcUserResendOtpHandler : Symbol.for("GrpcUserResendOtpHandler"),
  GrpcUserForgotPasswordHandler : Symbol.for("GrpcUserForgotPasswordHandler"),
  GrpcUserResetPasswordHandler : Symbol.for("GrpcUserResetPasswordHandler"),
  GrpcOAuthHandler : Symbol.for("GrpcOAuthHandler"),
  GrpcRefreshTokenHandler : Symbol.for("GrpcRefreshTokenHandler"),
  GrpcUserProfileHandler : Symbol.for("GrpcUserProfileHandler")

};

export default TYPES;