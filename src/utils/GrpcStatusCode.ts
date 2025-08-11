import { status } from "@grpc/grpc-js";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { AuthSuccessType } from "@/domain/enums/authenticateUser/SuccessType";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";

/**
 * Maps a known domain message to a gRPC status code.
 * 
 * @param {string} message - The domain message from enum.
 * @returns {status} gRPC status code
 */
export const mapMessageToGrpcStatus = (message: string): status => {
  switch (message) {

    // ====== Authentication Errors ======
    case AuthenticateUserErrorType.AccountNotFound:
    case AuthenticateUserErrorType.EmailOrPasswordWrong:
      return status.INVALID_ARGUMENT;

    case AuthenticateUserErrorType.AuthProviderWrong:
    case AuthenticateUserErrorType.InvalidAuthenticationMethod:
      return status.FAILED_PRECONDITION;

    case AuthenticateUserErrorType.InvalidOrExpiredOtp:
      return status.PERMISSION_DENIED;

    // ====== User Errors ======

    case UserErrorType.UserAlreadyExists:
    case AuthenticateUserErrorType.AccountAlreadyExist:
      return status.ALREADY_EXISTS;

    case UserErrorType.UserDoesNotExist:
    case UserErrorType.UserNotFound:
      return status.NOT_FOUND;

    case UserErrorType.AccessTokenIssueError:
    case UserErrorType.RefreshTokenIssueError:
      return status.INTERNAL;

    case UserErrorType.AlreadyVerified:
      return status.FAILED_PRECONDITION;

    // ====== Success Messages (optional handling) ======

    case AuthSuccessType.VerificationOtpSend:
    case AuthSuccessType.AuthenticationSuccess:
    case UserSuccessType.UserDeleted:
    case UserSuccessType.SignupSuccess:
    case UserSuccessType.OtpSendSuccess:
    case UserSuccessType.TokenIssued:
    case UserSuccessType.PasswordChangedSuccessfully:
      return status.OK;

    // ====== Default for unknown message ======
    
    default:
      return status.UNKNOWN;
  }
};
