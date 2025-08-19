import { IResendOtpUseCase } from "@/app/useCases/Authentication/ResendOtp";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { ResendOtpRequest, ResendOtpResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class for handling resend otp.
 * 
 * @class
 */
@injectable()
export class GrpcUserResendOtpHandler {

    #_resendOtpUseCase : IResendOtpUseCase

    /**
     * 
     * @param {IResendOtpUseCase} resendOtpUseCase - The use case for resend otp to user.
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
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    resendOtp = async (
        call : ServerUnaryCall<ResendOtpRequest,ResendOtpResponse>,
        callback : sendUnaryData<ResendOtpResponse>
    ) => {
        const startTime = Date.now(); // for latency
        const method = 'resendOtp'
        try {
            const req = call.request;

            const result = await this.#_resendOtpUseCase.execute(req.email);

            if(!result.success){
                return callback({
                    code : mapMessageToGrpcStatus(result.message),
                    message : result.message
                },null)
            }
            return callback(null,{
                message : result.message
            });

        } catch (error : any) {
            logger.error(SystemErrorType.InternalServerError,error);
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