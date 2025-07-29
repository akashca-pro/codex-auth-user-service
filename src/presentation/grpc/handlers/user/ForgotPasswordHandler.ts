import { IForgotPasswordUseCase } from "@/app/useCases/Authentication/ForgotPasswordUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";
import { grpcMetricsCollector } from "@/helpers/grpcMetricsCollector";

/**
 * Class for handling forgot password.
 * 
 * @class
 */
@injectable()
export class GrpcUserForgotPasswordHandler {

    /**
     * 
     * @param {IForgotPasswordUseCase} forgotPasswordUseCase - The use case for forgot password for the user.
     * @constructor
     */
    constructor(
        @inject(TYPES.ForgotPasswordUseCase)
        private forgotPasswordUseCase : IForgotPasswordUseCase
    ){}

    /**
     * This method handles the forgot password use case.
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    forgotPassword = async (
        call : ServerUnaryCall<ForgotPasswordRequest,ForgotPasswordResponse>,
        callback : sendUnaryData<ForgotPasswordResponse>
    ) => {
        const startTime = Date.now(); // for latency
        const method = 'forgotPassword'
        try {
            
            const req = call.request;
            const result = await this.forgotPasswordUseCase.execute(req.email);

            if(!result.success){
                grpcMetricsCollector(method,result.data.message,startTime);
                return callback({
                    code : mapMessageToGrpcStatus(result.data.message),
                    message : result.data.message
                },null)
            }

            grpcMetricsCollector(method,result.data.message,startTime);
            return callback(null,result.data);

        } catch (error : any) {
            logger.error(SystemErrorType.InternalServerError,error);
            grpcMetricsCollector(method,error.message,startTime);

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