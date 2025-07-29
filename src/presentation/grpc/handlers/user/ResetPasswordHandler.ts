import { IResetPasswordUseCase } from "@/app/useCases/Authentication/ResetPasswordUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { ResetPasswordRequest, ResetPasswordResponse } from "@akashcapro/codex-shared-utils";
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
export class GrpcUserResetPasswordHandler {

    /**
     * 
     * @param {IResetPasswordUseCase} resetPasswordUseCase - The Usecase for creation of the user.
     * @constructor 
     */
    constructor(
        @inject(TYPES.ResetPasswordUseCase)
        private resetPasswordUseCase : IResetPasswordUseCase
    ){}

    /**
     * This method handles the resetPassword use case.
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    ResetPassword = async(
        call : ServerUnaryCall<ResetPasswordRequest,ResetPasswordResponse>,
        callback : sendUnaryData<ResetPasswordResponse>
    ) => {
        const startTime = Date.now(); // for latency
        const method = 'resetPassword'
        try {
            
            const req = call.request;

            const result = await this.resetPasswordUseCase.execute({
                email : req.email,
                newPassword : req.newPassword,
                otp : req.otp
            })

            if(!result.success){
                grpcMetricsCollector(method,result.data.message,startTime)
                return callback({
                    code : mapMessageToGrpcStatus(result.data.message),
                    message : result.data.message
                },null)
            }

            grpcMetricsCollector(method,result.data.message,startTime)
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