import { IResendOtpUseCase } from "@/app/useCases/Authentication/ResendOtp";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { ResendOtpRequest, ResendOtpResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // baseLogger imported as logger
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class for handling resend otp.
 * * @class
 */
@injectable()
export class GrpcUserResendOtpHandler {

    #_resendOtpUseCase : IResendOtpUseCase

    /**
     * * @param {IResendOtpUseCase} resendOtpUseCase - The use case for resend otp to user.
     * @constructor
     */
    constructor(
        @inject(TYPES.ResendOtpUseCase)
        resendOtpUseCase : IResendOtpUseCase
    ){
        this.#_resendOtpUseCase = resendOtpUseCase
    }

    /**
     * This method handles the resend otp use case.
     * * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    resendOtp = async (
        call : ServerUnaryCall<ResendOtpRequest,ResendOtpResponse>,
        callback : sendUnaryData<ResendOtpResponse>
    ) => {
        const { email, otpType } = call.request; // Destructure context fields

        try {
            // Log 1: Request received
            logger.info('gRPC handler received resend OTP request', { email, otpType });

            const result = await this.#_resendOtpUseCase.execute(call.request);
            
            if(!result.success){
                // Log 2A: UseCase failure (e.g., rate limit, user not found)
                logger.warn('Resend OTP UseCase failed', { 
                    email, 
                    otpType,
                    message: result.message 
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success (New OTP issued)
            logger.info('Resend OTP UseCase succeeded', { 
                email, 
                otpType,
                message: result.message || 'New OTP issued'
            });

            return callback(null,{
                message : result.message!
            });
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during resend OTP', { 
                email, 
                otpType, 
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
     * This method ensures that the `resendOtp` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            resendOtp : this.resendOtp.bind(this)
        } 
    }
}