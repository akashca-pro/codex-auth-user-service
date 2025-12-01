import TYPES from "@/config/inversify/types";
import { IUserRepository } from "@/domain/repository/User";
import { IVerifySignUpOtpUseCase } from "../VerifySignup";
import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { IVerifySignUpOtp } from "@/domain/dtos/Authenticate/VerifyOtp";
import { ResponseDTO } from "@/domain/dtos/Response";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { OtpType } from "@/domain/enums/OtpType";
import { User } from "@/domain/entities/User";
import { UserRole } from "@/generated/prisma";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { inject, injectable } from "inversify";
import { randomUUID } from "node:crypto";
import { VerifyOtpRequest } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // Import the logger

/**
 * Use case for verifying user signup otp.
 * * @class
 * @implements {IVerifySignUpOtpUseCase}
 */
@injectable()
export class VerifySignUpOtpUseCase implements IVerifySignUpOtpUseCase {

    #_userRepository : IUserRepository
    #_tokenProvider : ITokenProvider
    #_otpService : IOtpService

    /**
     * Creates an instance of SignupUserUseCase.
     * * @param {IUserRepository} userRepository - The repository of the user.
     * @param {ITokenProvider} tokenProvider - The token provider for issueing access and refresh token.
     * @param {IOtpService} otpService - Otp service provider for verification.
     */
    constructor(
        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository,

        @inject(TYPES.ITokenProvider)
        tokenProvider : ITokenProvider,

        @inject(TYPES.IOtpService)
        otpService : IOtpService
    ){
        this.#_otpService = otpService,
        this.#_tokenProvider = tokenProvider,
        this.#_userRepository = userRepository 
    }

    async execute(
        request : VerifyOtpRequest
    ): Promise<ResponseDTO> {
        const dto : IVerifySignUpOtp = {
            email : request.email,
            otp : request.otp
        }

        // Log 1: Execution start
        logger.info('VerifySignUpOtpUseCase execution started', { email: dto.email });

        const user = await this.#_userRepository.findByEmail(dto.email) 
        
        if(!user){
            // Log 2A: User not found
            logger.warn('OTP verification failed: account not found', { email: dto.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountNotFound,
                success : false
            }
        }
        
        // Log 2B: Attempting OTP verification
        logger.debug('Attempting to verify sign-up OTP', { userId: user.userId, email: dto.email });
        const isOtpVerified = await this.#_otpService.verifyOtp(
            dto.email,
            OtpType.SIGNUP,
            dto.otp
        );

        if(!isOtpVerified){
            // Log 2C: OTP verification failed
            logger.warn('OTP verification failed: invalid OTP provided', { userId: user.userId, email: dto.email });
            return {
                data : null,
                message : AuthenticateUserErrorType.EmailOrPasswordWrong,
                success : false
            }
        }
        
        // Log 3: OTP verified, updating user status
        logger.info('OTP successfully verified. Marking user as verified', { userId: user.userId });
        
        const userEntity = User.rehydrate(user);
        userEntity.update({isVerified : true});
        
        await this.#_userRepository.update(
            user.userId,
            userEntity.getUpdatedFields()
        );
        
        // Log 4: Clearing OTP
        logger.debug('Clearing sign-up OTP after successful verification', { userId: user.userId });
        await this.#_otpService.clearOtp(
            dto.email,
            OtpType.SIGNUP
        );
        
        // Log 5: Generating tokens
        logger.info('User successfully verified. Generating access and refresh tokens.', { userId: user.userId });
        
        const payload : ITokenPayLoadDTO = {
            userId : user.userId,
            email : user.email,
            role : UserRole.USER,
            tokenId : randomUUID()
        }
        
        const accessToken = this.#_tokenProvider.generateAccessToken(payload);
        const refreshToken = this.#_tokenProvider.generateRefreshToken(payload);
        
        if(!accessToken) {
            logger.error('Token generation error: Access token could not be issued.', { userId: user.userId });
            throw new Error(UserErrorType.AccessTokenIssueError);
        }
        if(!refreshToken) {
            logger.error('Token generation error: Refresh token could not be issued.', { userId: user.userId });
            throw new Error(UserErrorType.RefreshTokenIssueError);
        }

        // Log 6: Execution successful
        logger.info('VerifySignUpOtpUseCase completed successfully.', { userId: user.userId });

        return { 
            data : { 
                accessToken,
                refreshToken,
                userInfo : {
                    userId : user.userId,
                    username : user.username,
                    email : user.email,
                    role : user.role,
                    avatar : user.avatar ?? null
                }
            },
            message : UserSuccessType.SignupSuccess,    
            success : true
        }
    }
}