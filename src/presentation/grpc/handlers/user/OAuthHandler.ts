import { IAuthenticateOAuthUserUseCase } from "@/app/useCases/Authentication/AuthenticateOAuthUser";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { OAuthLoginRequest, OAuthLoginResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // baseLogger imported as logger
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class for handling oAuth login.
 * * @class
 */
@injectable()
export class GrpcOAuthHandler {

    
    #_oAuthUseCase : IAuthenticateOAuthUserUseCase

    /**
     * * @param {IAuthenticateOAuthUserUseCase} oAuthUseCase - The use case for register o auth user.
     * @constructor
     */
    constructor(
        @inject(TYPES.AuthenticateOAuthUserUseCase)
        oAuthUseCase : IAuthenticateOAuthUserUseCase
    ){
        this.#_oAuthUseCase = oAuthUseCase
    }

    /**
     * This method handles the o auth authentication use case.
     * * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    oAuthLogin = async (
        call : ServerUnaryCall<OAuthLoginRequest,OAuthLoginResponse>,
        callback : sendUnaryData<OAuthLoginResponse>
    ) : Promise<void> => {
        const { oAuthId, email } = call.request; // Destructure context fields

        try {
            // Log 1: Request received
            logger.info('gRPC handler received OAuth login request', { oAuthId, email });

            const result = await this.#_oAuthUseCase.execute(call.request);
            
            if(!result.success){
                // Log 2A: UseCase failure
                logger.warn('OAuth authentication UseCase failed', { 
                    oAuthId, 
                    email,
                    message: result.message 
                });
                
                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }
            
            // Log 2B: UseCase success
            logger.info('OAuth authentication UseCase succeeded', { 
                oAuthId, 
                email,
                userId: result.data.userInfo.userId,
                message: result.message 
            });

            return callback(null,{
                accessToken : result.data.accessToken,
                refreshToken : result.data.refreshToken,
                message : result.message!,
                userInfo : result.data.userInfo
            });
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during OAuth login', { 
                oAuthId, 
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
     * This method ensures that the `oAuthLogin` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            oAuthLogin : this.oAuthLogin.bind(this)
        } 
    }

}