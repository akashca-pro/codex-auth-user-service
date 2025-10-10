import { IVerifySignUpOtpUseCase } from "@/app/useCases/Authentication/VerifySignup";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { VerifyOtpRequest, VerifyOtpResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // baseLogger imported as logger
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class for handling verify otp after signup.
 * * @class
 */
@injectable()
export class GrpcUserVerifySignupOtpHandler {

    #_verifySignupOtpUseCase : IVerifySignUpOtpUseCase
    
    /**
     * * @param {IVerifySignUpOtpUseCase} verifySignupOtpUseCase - The Usecase for verify otp of the user.
     * @constructor
     */
    constructor(
        @inject(TYPES.VerifySignUpOtpUseCase)
        verifySignupOtpUseCase : IVerifySignUpOtpUseCase
    ){
        this.#_verifySignupOtpUseCase = verifySignupOtpUseCase
    }

    /**
     * This method handles the verify sign otp use case.
     * * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    verifyOtp = async (
        call : ServerUnaryCall<VerifyOtpRequest,VerifyOtpResponse>,
        callback : sendUnaryData<VerifyOtpResponse>
    ) : Promise<void> => {
        const { email } = call.request; // Extract email for context

        try {
            // Log 1: Request received
            logger.info('gRPC handler received signup OTP verification request', { email });

            const result = await this.#_verifySignupOtpUseCase.execute(call.request);
            
            if(!result.success){
                // Log 2A: UseCase failure (e.g., invalid OTP, expired OTP)
                logger.warn('Signup OTP verification UseCase failed', { 
                    email, 
                    message: result.message 
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success (User activated, tokens issued)
            logger.info('Signup OTP verification UseCase succeeded', { 
                email, 
                userId: result.data.userInfo.userId,
                message: result.message || 'User successfully verified and authenticated'
            });

            return callback(null,{
                accessToken : result.data.accessToken,
                refreshToken : result.data.refreshToken,
                userInfo : result.data.userInfo,
                message : result.message!
            });
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during signup OTP verification', { 
                email, 
                error 
            });

            return callback({
                code : status.INTERNAL,
                message : SystemErrorType.InternalServerError
            },null);
        }
    }

    /**
     * Returns the bound handler method for the gRPC service.
     *
     * @remarks
     * This method ensures that the `verifyOtp` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            verifyOtp : this.verifyOtp.bind(this)
        } 
    }

}