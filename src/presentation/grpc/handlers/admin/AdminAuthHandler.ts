import { IAuthenticateLocalAuthUserUseCase } from "@/app/useCases/Authentication/AuthenticateLocalAuthUser";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { LoginRequest, LoginResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/pinoLogger'; // baseLogger imported as logger
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";
import { UserRole } from "@/domain/enums/UserRole";


/**
 * Class for handling Admin login.
 * * @class
 */
@injectable()
export class GrpcAdminAuthHandler {

    #_authenticateLocalAuthUserUseCase : IAuthenticateLocalAuthUserUseCase

    /**
     * * @param {IAuthenticateLocalAuthUserUseCase} authenticateLocalAuthUserUseCase - The Usecase for authenticate user.
     * @constructor
     */
    constructor(
        @inject(TYPES.AuthenticateLocalUserUseCase)
        authenticateLocalAuthUserUseCase : IAuthenticateLocalAuthUserUseCase
    ){
        this.#_authenticateLocalAuthUserUseCase = authenticateLocalAuthUserUseCase
    }

    /**
     * This method handles the Admin local authentication use case.
     * * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    login = async (
        call : ServerUnaryCall<LoginRequest,LoginResponse>,
        callback : sendUnaryData<LoginResponse>
    ) : Promise<void> => {
        const req = call.request;
        const email = req.email;
        const role = UserRole.ADMIN;

        try {
            // Log 1: Request received
            logger.info('gRPC handler received Admin login request', { email, role });

            const result = await this.#_authenticateLocalAuthUserUseCase.execute({
                email : req.email,
                password : req.password,
                role : role
            })

            if(!result.success){
                // Log 2A: UseCase failure
                logger.warn('Admin authentication UseCase failed', { 
                    email, 
                    role,
                    message: result.message 
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success
            logger.info('Admin authentication UseCase succeeded', { 
                email, 
                role,
                userId: result.data.userInfo.userId,
                message: result.message || 'Admin login successful'
            });

            return callback(null,result.data);
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during Admin login', { 
                email, 
                role,
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