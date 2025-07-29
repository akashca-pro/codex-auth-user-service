import { IOtpService } from "@/app/providers/GenerateAndSendOtp"
import { ITokenProvider } from "@/app/providers/GenerateTokens"
import { IPasswordHasher } from "@/app/providers/PasswordHasher"
import { IUserRepository } from "@/app/repository/User"
import { AuthenticateLocalUserUseCase } from "@/app/useCases/Authentication/implementation/AuthenticateLocalUser"
import { IUserInRequestDTO } from '@/domain/dtos/User/UserIn'
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType"
import { AuthProvider } from "@/domain/enums/AuthProvider"
import { OtpType } from "@/domain/enums/OtpType"
import { UserRole } from "@/domain/enums/UserRole"

// Testing authentication use case

const mockUserRepository = {
    findByEmail : jest.fn(),
}

const mockPasswordHasher = {
    comparePasswords : jest.fn(),
}

const mockTokenService = {
    generateAccessToken : jest.fn(),
    generateRefreshToken : jest.fn()
}

const mockOtpService = {
    generateAndSendOtp : jest.fn(),
    clearOtp : jest.fn(),
}

const useCase = new AuthenticateLocalUserUseCase(
    mockUserRepository as unknown as IUserRepository,
    mockPasswordHasher as unknown as IPasswordHasher,
    mockTokenService as unknown as ITokenProvider,
    mockOtpService as unknown as IOtpService
)

// Success auth test case

it("should authenticate successfully", async () => {
  const user: IUserInRequestDTO = {
    userId: "123",
    email: "test@example.com",
    password: "hashed-password",
    role: UserRole.USER,
    authProvider: AuthProvider.LOCAL,
    isVerified: true,
    username: "test",
    avatar: "pic",
    country: "india",
    firstName: "Test",
    lastName: "User",
    isArchived: false,
    preferredLanguage: "js",
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSubmission: 0,
    streak: 0,
    oAuthId : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockUserRepository.findByEmail.mockResolvedValue(user);
  mockPasswordHasher.comparePasswords.mockResolvedValue(true);
  mockTokenService.generateAccessToken.mockReturnValue("accessToken");
  mockTokenService.generateRefreshToken.mockReturnValue("refreshToken");

  const result = await useCase.execute({
    email: "test@example.com",
    password: "plain-password"
  });

  expect(result.success).toBe(true);
  expect(result.data.accessToken).toBe("accessToken");
  expect(result.data.refreshToken).toBe("refreshToken");
});

// User not found test case

it("should return error if user not found", async () => {
  mockUserRepository.findByEmail.mockResolvedValue(null);

  const result = await useCase.execute({
    email: "notfound@example.com",
    password: "any"
  });

  expect(result.success).toBe(false);
  expect(result.data.message).toBe(AuthenticateUserErrorType.EmailOrPasswordWrong);
});

// Wrong password test case.

it("should return error if password is incorrect", async () => {
  mockUserRepository.findByEmail.mockResolvedValue({
    email: "user@example.com",
    password: "hashed",
    authProvider: AuthProvider.LOCAL,
    isVerified: true,
  });
  mockPasswordHasher.comparePasswords.mockResolvedValue(false);

  const result = await useCase.execute({
    email: "user@example.com",
    password: "wrong-password"
  });

  expect(result.success).toBe(false);
  expect(result.data.message).toBe(AuthenticateUserErrorType.EmailOrPasswordWrong);
});

// Not verified test case.

it("should resend verification OTP if user not verified", async () => {
  mockUserRepository.findByEmail.mockResolvedValue({
    email: "user@example.com",
    password: "hashed",
    authProvider: AuthProvider.LOCAL,
    isVerified: false,
  });
  mockPasswordHasher.comparePasswords.mockResolvedValue(true);

  const result = await useCase.execute({
    email: "user@example.com",
    password: "correct-password"
  });

  expect(mockOtpService.clearOtp).toHaveBeenCalledWith("user@example.com", OtpType.SIGNUP);
  expect(mockOtpService.generateAndSendOtp).toHaveBeenCalledWith("user@example.com", OtpType.SIGNUP);
  expect(result.success).toBe(false);
});

// Wrong auth provider test case

it("should fail if auth provider is not LOCAL", async () => {
  mockUserRepository.findByEmail.mockResolvedValue({
    email: "user@example.com",
    password: null,
    authProvider: AuthProvider.GOOGLE,
    isVerified: true,
  });

  const result = await useCase.execute({
    email: "user@example.com",
    password: "irrelevant"
  });

  expect(result.success).toBe(false);
  expect(result.data.message).toBe(AuthenticateUserErrorType.AuthProviderWrong);
});