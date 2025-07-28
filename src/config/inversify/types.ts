const TYPES = {
  IUserRepository: Symbol.for("IUserRepository"),
  IPasswordHasher: Symbol.for("IPasswordHasher"),
  ITokenProvider: Symbol.for("ITokenProvider"),
  IOtpService: Symbol.for("IOtpService"),

  AuthenticateLocalUserUseCase: Symbol.for("AuthenticateLocalUserUseCase"),
  AuthenticateOAuthUserUseCase : Symbol.for("AuthenticateOAuthUserUseCase"),
  ForgotPasswordUseCase : Symbol.for("ForgotPasswordUseCase"),
  ResetPasswordUseCase : Symbol.for("ResetPasswordUseCase"),
  RefreshTokenEndpointUseCase : Symbol.for("RefreshTokenEndpointUseCase"),
  ResendOtpUseCase : Symbol.for("ResendOtpUseCase"),
  VerifySignUpOtpUseCase : Symbol.for("VerifySignUpOtpUseCase"),
  ProfileUserUseCase : Symbol.for("ProfileUserUseCase"),
  SignUpUserUseCase : Symbol.for("SignUpUserUseCase"),

  GrpcAuthHandler : Symbol.for("GrpcAuthHandler"),
  
  GrpcUserSignupHandler : Symbol.for("GrpcUserSignupHandler"),

};

export default TYPES;