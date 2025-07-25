import { VerifySignUpOtpUseCase } from "@/app/useCases/Authentication/implementation/VerifySignup"; 
import { IUserRepository } from "@/app/repository/User";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { ITokenService } from "@/app/providers/GenerateTokens";
import { User } from "@/domain/entities/User";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn"; 
import { AuthProvider } from "@/domain/enums/AuthProvider";
import { UserRole } from "@/domain/enums/UserRole";

// Mocks
const mockUserRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  update: jest.fn(),
} as any;

const mockOtpService: jest.Mocked<IOtpService> = {
  verifyOtp: jest.fn(),
  clearOtp: jest.fn(),
  generateAndSendOtp: jest.fn(),
} as any;

const mockTokenService: jest.Mocked<ITokenService> = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
} as any;

const useCase = new VerifySignUpOtpUseCase(
  mockUserRepository,
  mockOtpService,
  mockTokenService
);

// Sample mock user
const mockUser: IUserInRequestDTO = {
  userId: "user-123",
  role: UserRole.USER,
  email: "test@example.com",
  username: "testuser",
  firstName: "Test",
  lastName: null,
  avatar: null,
  authProvider: AuthProvider.LOCAL,
  password: "hashed-password",
  oAuthId: null,
  country: "IN",
  isVerified: false,
  isArchived: false,
  preferredLanguage: "en",
  easySolved: null,
  mediumSolved: null,
  hardSolved: null,
  totalSubmission: null,
  streak: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock("@/domain/entities/User", () => ({
  User: {
    rehydrate: jest.fn(() => {
      return {
        update: jest.fn(),
        getUpdatedFields: jest.fn(() => ({ isVerified: true })),
      };
    }),
  },
}));


describe("VerifySignUpOtpUseCase", () => {
  const email = "test@example.com";
  const otp = "123456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if user not found", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute({ email, otp });

    expect(result.success).toBe(false);
    expect(result.data.message).toBe(AuthenticateUserErrorType.AccountNotFound);
  });

  it("should return error if OTP is invalid", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockOtpService.verifyOtp.mockResolvedValue(false);

    const result = await useCase.execute({ email, otp });

    expect(result.success).toBe(false);
    expect(result.data.message).toBe(AuthenticateUserErrorType.InvalidOrExpiredOtp);
  });

  it("should return success with tokens if OTP is valid", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockOtpService.verifyOtp.mockResolvedValue(true);
    mockTokenService.generateAccessToken.mockReturnValue("access-token");
    mockTokenService.generateRefreshToken.mockReturnValue("refresh-token");

    const result = await useCase.execute({ email, otp });

    expect(result.success).toBe(true);
    expect(result.data.message).toBe(UserSuccessType.SignupSuccess);
    expect(result.data.accessToken).toBe("access-token");
    expect(result.data.refreshToken).toBe("refresh-token");
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(mockOtpService.clearOtp).toHaveBeenCalledWith(email, OtpType.SIGNUP);
  });

  it("should handle exceptions gracefully", async () => {
    mockUserRepository.findByEmail.mockRejectedValue(new Error("DB Error"));

    const result = await useCase.execute({ email, otp });

    expect(result.success).toBe(false);
    expect(result.data.message).toBe(SystemErrorType.InternalServerError);
  });
});
