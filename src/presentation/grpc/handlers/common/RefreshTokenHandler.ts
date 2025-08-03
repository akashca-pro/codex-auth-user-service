import { IRefreshTokenUseCase } from "@/app/useCases/Authentication/RefreshTokenUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { RefreshTokenRequest, RefreshTokenResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class for handling Refresh token.
 * 
 * @class
 */
@injectable()
export class GrpcRefreshTokenHandler {

    #_refreshTokenUseCase : IRefreshTokenUseCase

    /**
     * 
     * @param {IRefreshTokenUseCase} refreshTokenUseCase - The use case of refresh token.
     * @constructor
     */
    constructor(
        @inject(TYPES.RefreshTokenUseCase)
        refreshTokenUseCase : IRefreshTokenUseCase
    ){
        this.#_refreshTokenUseCase = refreshTokenUseCase
    }

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

        try {
            
            const req = call.request;
            const result = await this.#_refreshTokenUseCase.execute({
                userId : req.userId,
                email : req.email,
                role : req.role
            });

            if(!result.success){
                return callback({
                    code : mapMessageToGrpcStatus(result.message),
                    message : result.message
                },null)
            }
          
            return callback(null,{
                accessToken : result.data.accessToken,
                message : result.message,
                userInfo : result.data.userInfo
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