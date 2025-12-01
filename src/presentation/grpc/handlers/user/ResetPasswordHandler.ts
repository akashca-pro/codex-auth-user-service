import { IResetPasswordUseCase } from "@/app/useCases/Authentication/ResetPasswordUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { ResetPasswordRequest, ResetPasswordResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // baseLogger imported as logger
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class for handling forgot password.
 * * @class
 */
@injectable()
export class GrpcUserResetPasswordHandler {

    #_resetPasswordUseCase : IResetPasswordUseCase

    /**
     * * @param {IResetPasswordUseCase} resetPasswordUseCase - The Usecase for creation of the user.
     * @constructor 
     */
    constructor(
        @inject(TYPES.ResetPasswordUseCase)
        resetPasswordUseCase : IResetPasswordUseCase
    ){
        this.#_resetPasswordUseCase = resetPasswordUseCase
    }

    /**
     * This method handles the resetPassword use case.
     * * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    ResetPassword = async(
        call : ServerUnaryCall<ResetPasswordRequest,ResetPasswordResponse>,
        callback : sendUnaryData<ResetPasswordResponse>
    ) => {
        const { email } = call.request; // Extract email for context

        try {
            // Log 1: Request received
            logger.info('gRPC handler received password reset request', { email });

            const result = await this.#_resetPasswordUseCase.execute(call.request)
            
            if(!result.success){
                // Log 2A: UseCase failure (e.g., invalid OTP, user not found)
                logger.warn('Password reset UseCase failed', { 
                    email, 
                    message: result.message 
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }
            
            // Log 2B: UseCase success
            logger.info('Password reset UseCase succeeded', { 
                email, 
                message: result.message || 'Password successfully reset'
            });

            return callback(null,{
                message : result.message!
            });
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during password reset', { 
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
     * This method ensures that the `changePassword` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            resetPassword : this.ResetPassword.bind(this)
        } 
    }
}