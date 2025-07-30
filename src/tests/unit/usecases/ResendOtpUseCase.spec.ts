import { ResendOtpUseCase } from "@/app/useCases/Authentication/implementation/ResendOtpUseCase";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { IUserRepository } from "@/domain/repository/User";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";


import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn";
import { AuthProvider } from "@/domain/enums/AuthProvider";
import { UserRole } from "@/domain/enums/UserRole";


const mockUser: IUserInRequestDTO = {
  userId: "123",
  role: UserRole.USER,
  email: "test@example.com",
  username: "testuser",
  firstName: "Test",
  lastName: null,
  avatar: null,
  authProvider: AuthProvider.LOCAL,
  password: "hashedpassword",
  oAuthId: null,
  country: "IN",
  isVerified: true,
  isArchived: false,
  preferredLanguage: null,
  easySolved: null,
  mediumSolved: null,
  hardSolved: null,
  totalSubmission: null,
  streak: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};


describe("ResendOtpUseCase", () => {
  let resendOtpUseCase: ResendOtpUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockOtpService: jest.Mocked<IOtpService>;

  const email = "test@example.com";

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
    } as any;

    mockOtpService = {
      clearOtp: jest.fn(),
      generateAndSendOtp: jest.fn(),
    } as any;

    resendOtpUseCase = new ResendOtpUseCase(mockUserRepository, mockOtpService);
  });

  it("should return error if user is not found", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const response = await resendOtpUseCase.execute(email);

    expect(response.success).toBe(false);
    expect(response.data.message).toBe(AuthenticateUserErrorType.AccountNotFound);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

    it("should return error if user is already verified", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    const response = await resendOtpUseCase.execute(email);

    expect(response.success).toBe(false);
    expect(response.data.message).toBe(UserErrorType.AlreadyVerified);
    });

  it("should resend OTP successfully for unverified user", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      ...mockUser,
      isVerified: false,
    });

    const response = await resendOtpUseCase.execute(email);

    expect(mockOtpService.clearOtp).toHaveBeenCalledWith(email, OtpType.SIGNUP);
    expect(mockOtpService.generateAndSendOtp).toHaveBeenCalledWith(email, OtpType.SIGNUP);
    expect(response.success).toBe(true);
    expect(response.data.message).toBe(UserSuccessType.OtpSendSuccess);
  });

  it("should return internal error on unexpected failure", async () => {
    mockUserRepository.findByEmail.mockRejectedValue(new Error("DB down"));

    const response = await resendOtpUseCase.execute(email);

    expect(response.success).toBe(false);
    expect(response.data.message).toBe(SystemErrorType.InternalServerError);
  });
});
