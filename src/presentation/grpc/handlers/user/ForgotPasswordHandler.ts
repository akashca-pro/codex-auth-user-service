import { IForgotPasswordUseCase } from "@/app/useCases/Authentication/ForgotPasswordUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // baseLogger imported as logger
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class for handling forgot password.
 * * @class
 */
@injectable()
export class GrpcUserForgotPasswordHandler {

    #_forgotPasswordUseCase : IForgotPasswordUseCase

    /**
     * * @param {IForgotPasswordUseCase} forgotPasswordUseCase - The use case for forgot password for the user.
     * @constructor
     */
    constructor(
        @inject(TYPES.ForgotPasswordUseCase)
        forgotPasswordUseCase : IForgotPasswordUseCase
    ){
        this.#_forgotPasswordUseCase = forgotPasswordUseCase
    }

    /**
     * This method handles the forgot password use case.
     * * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    forgotPassword = async (
        call : ServerUnaryCall<ForgotPasswordRequest,ForgotPasswordResponse>,
        callback : sendUnaryData<ForgotPasswordResponse>
    ) => {
        const req = call.request;
        const email = req.email; // Extract email for context

        try {
            // Log 1: Request received
            logger.info('gRPC handler received forgot password request', { email });

            const result = await this.#_forgotPasswordUseCase.execute(req.email);

            if(!result.success){
                // Log 2A: UseCase failure (e.g., user not found, rate limit)
                logger.warn('Forgot password UseCase failed', { 
                    email, 
                    message: result.message 
                });
                
                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success (OTP issued)
            logger.info('Forgot password UseCase succeeded', { 
                email, 
                message: result.message || 'OTP issued' 
            });

            return callback(null,{
                message : result.message!
            });

        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during forgot password', { 
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
     * This method ensures that the `forgotPassword` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            forgotPassword : this.forgotPassword.bind(this)
        } 
    }

}