import { IChangePassUseCase } from "@/app/useCases/User/ChangePass.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger"; // baseLogger imported as logger
import { ChangePasswordRequest } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class handling the change password usecase.
 * * @class
 */
@injectable()
export class GrpcChangePassHandler {

    #_changePassUseCase : IChangePassUseCase

    constructor(
        @inject(TYPES.ChangePassUseCase) changePassUseCase : IChangePassUseCase
    ){
        this.#_changePassUseCase = changePassUseCase
    }

    changePassword = async (
        call : ServerUnaryCall<ChangePasswordRequest, Empty>,
        callback : sendUnaryData<Empty>
    ) => {
        const { userId } = call.request; // Destructure userId for context

        try {
            // Log 1: Request received
            logger.info('gRPC handler received change password request', { userId });

            const result = await this.#_changePassUseCase.execute(call.request)
            
            if(!result.success){
                // Log 2A: UseCase failure
                logger.warn('Change password UseCase failed', { 
                    userId, 
                    message: result.message 
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success
            logger.info('Change password UseCase succeeded', { 
                userId, 
                message: result.message || 'Password changed successfully'
            });

            return callback(null,{});
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during change password', { 
                userId, 
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
     * This method ensures that the `changePassword` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            changePassword : this.changePassword.bind(this)
        } 
    }

}