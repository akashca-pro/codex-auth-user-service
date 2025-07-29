import { IRefreshTokenUseCase } from "@/app/useCases/Authentication/RefreshTokenUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { RefreshTokenRequest, RefreshTokenResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";
import { grpcMetricsCollector } from "@/helpers/grpcMetricsCollector";

/**
 * Class for handling Refresh token.
 * 
 * @class
 */
@injectable()
export class GrpcRefreshTokenHandler {


    /**
     * 
     * @param {IRefreshTokenUseCase} refreshTokenUseCase - The use case of refresh token.
     * @constructor
     */
    constructor(
        @inject(TYPES.RefreshTokenUseCase)
        private refreshTokenUseCase : IRefreshTokenUseCase
    ){}

    /**
     * This method handles the refreshToken use case.
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    refreshToken = async (
        call : ServerUnaryCall<RefreshTokenRequest,RefreshTokenResponse>,
        callback : sendUnaryData<RefreshTokenResponse>
    ) => {
        const startTime = Date.now(); // for latency
        const method = 'refreshToken'
        try {
            
            const req = call.request;
            const result = await this.refreshTokenUseCase.execute({
                userId : req.userId,
                email : req.email,
                role : req.role
            });

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
     * This method ensures that the `refreshToken` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            refreshToken : this.refreshToken.bind(this)
        } 
    }


}