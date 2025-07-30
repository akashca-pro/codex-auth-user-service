import { IAuthenticateLocalAuthUserUseCase } from "@/app/useCases/Authentication/AuthenticateLocalAuthUser";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { LoginRequest, LoginResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";
import { grpcMetricsCollector } from "@/helpers/grpcMetricsCollector";
import { UserRole } from "@/domain/enums/UserRole";


/**
 * Class for handling User login.
 * 
 * @class
 */
@injectable()
export class GrpcUserAuthHandler {

    /**
     * 
     * @param {IAuthenticateLocalAuthUserUseCase} _authenticateLocalAuthUserUseCase - The Usecase for authenticate user.
     * @constructor
     */
    constructor(
        @inject(TYPES.AuthenticateLocalUserUseCase)
        private _authenticateLocalAuthUserUseCase : IAuthenticateLocalAuthUserUseCase
    ){}

    /**
     * This method handles the user local authentication use case.
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    login = async (
        call : ServerUnaryCall<LoginRequest,LoginResponse>,
        callback : sendUnaryData<LoginResponse>
    ) : Promise<void> => {
        const startTime = Date.now(); // for latency
        const method = 'UserlocalAuthLogin'
        try {
            const req = call.request;
            const result = await this._authenticateLocalAuthUserUseCase.execute({
                email : req.email,
                password : req.password,
                role : UserRole.USER
            })

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
     * This method ensures that the `login` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            login : this.login.bind(this)
        } 
    }
}