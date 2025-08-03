import { IAuthenticateOAuthUserUseCase } from "@/app/useCases/Authentication/AuthenticateOAuthUser";
import TYPES from "@/config/inversify/types";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { UserRole } from "@/domain/enums/UserRole";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { OAuthLoginRequest, OAuthLoginResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class for handling oAuth login.
 * 
 * @class
 */
@injectable()
export class GrpcOAuthHandler {

    
    #_oAuthUseCase : IAuthenticateOAuthUserUseCase

    /**
     * 
     * @param {IAuthenticateOAuthUserUseCase} oAuthUseCase - The use case for register o auth user.
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
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    oAuthLogin = async (
        call : ServerUnaryCall<OAuthLoginRequest,OAuthLoginResponse>,
        callback : sendUnaryData<OAuthLoginResponse>
    ) : Promise<void> => {
        try {
            const req = call.request;
            const userData = UserMapper.toCreateOAuthUser(req,UserRole.USER)
            const result = await this.#_oAuthUseCase.execute(userData);

            if(!result.success){
                return callback({
                    code : mapMessageToGrpcStatus(result.message),
                    message : result.message
                },null)
            }

            return callback(null,{
                accessToken : result.data.accessToken,
                refreshToken : result.data.refreshToken,
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