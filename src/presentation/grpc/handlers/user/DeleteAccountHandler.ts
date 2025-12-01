import { IDeleteAccountUseCase } from "@/app/useCases/User/DeleteAccount.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger"; // baseLogger imported as logger
import { DeleteAccountRequest } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class handling the delete account usecase.
 * * @class
 */
@injectable()
export class GrpcDeleteAccountHandler {

    #_deleteAccountUseCase : IDeleteAccountUseCase

    constructor(
        @inject(TYPES.DeleteAccountUseCase) deleteAccountUseCase : IDeleteAccountUseCase
    ){
        this.#_deleteAccountUseCase = deleteAccountUseCase
    }

    deleteAccount = async(
        call : ServerUnaryCall<DeleteAccountRequest, Empty>,
        callback : sendUnaryData<Empty>
    ) => {
        const { userId } = call.request; // Destructure userId for context

        try {
            // Log 1: Request received
            logger.info('gRPC handler received delete account request', { userId });

            const result = await this.#_deleteAccountUseCase.execute(call.request)
            
            if(!result.success){
                // Log 2A: UseCase failure (e.g., wrong password, user not found)
                logger.warn('Delete account UseCase failed', { 
                    userId, 
                    message: result.message 
                });
                
                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success
            logger.info('Delete account UseCase succeeded', { 
                userId, 
                message: result.message || 'Account deleted successfully' 
            });

            return callback(null,{});
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during account deletion', { 
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
     * This method ensures that the `deleteAccount` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            deleteAccount : this.deleteAccount.bind(this)
        } 
    }
}