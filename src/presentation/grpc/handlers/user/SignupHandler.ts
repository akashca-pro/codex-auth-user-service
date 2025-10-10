import { ISignUpUserUseCase } from "@/app/useCases/User/SignupUserUseCase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { SignupRequest, SignupResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // baseLogger imported as logger
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";
import { UserErrorType } from "@/domain/enums/user/ErrorType";

/**
 * Class for handling user signup.
 * * @class
 */
@injectable()
export class GrpcUserSignupHandler {

    #_signupUserUseCase : ISignUpUserUseCase

    /**
     * * @param {ISignUpUserUseCase} signupUserUseCase - The Usecase for creation of the user.
     * @constructor
     */
    constructor(
        @inject(TYPES.SignUpUserUseCase)
        signupUserUseCase : ISignUpUserUseCase
    ){
        this.#_signupUserUseCase = signupUserUseCase
    }

    /**
     * This method handles the signup user use case.
     * * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    signup = async (
        call : ServerUnaryCall<SignupRequest,SignupResponse>,
        callback : sendUnaryData<SignupResponse>
    ) : Promise<void> => {
        const { email } = call.request; // Extract email for context

        try {
            // Log 1: Request received
            logger.info('gRPC handler received signup request', { email });

            const result = await this.#_signupUserUseCase.execute(call.request);
            
            if(!result.success){
                // Log 2A: UseCase failure (e.g., email already exists, invalid data)
                logger.warn('User signup UseCase failed', { 
                    email, 
                    message: result.message 
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success (User created, OTP sent)
            logger.info('User signup UseCase succeeded', { 
                email, 
                message: result.message || 'User created, OTP sent' 
            });

            return callback(null,{
                message : result.message!
            });
        } catch (error : any) {
            
            // Handle specific known error (InvalidCountryCode)
            if(error?.message === UserErrorType.InvalidCountryCode){
                logger.warn('Signup failed due to invalid country code', { 
                    email, 
                    error: error.message 
                });
                return callback({
                    code : mapMessageToGrpcStatus(error.message),
                    message : error.message
                })
            }

            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with uncaught internal error during signup', { 
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
     * This method ensures that the `signup` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object {
        return {
            signup : this.signup.bind(this)
        } 
    }

}