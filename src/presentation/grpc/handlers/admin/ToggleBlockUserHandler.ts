import { IToggleBlockUserUseCase } from "@/app/useCases/admin/toggleBlockUser.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger"; // baseLogger imported as logger
import { BlockUserRequest } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class for handling list users.
 * * @class
 */
@injectable()
export class GrpcToggleBlockUserHandler {

    #_toggleBlockUserUseCase : IToggleBlockUserUseCase

    constructor(
        @inject(TYPES.ToggleBlockUserUseCase)
        toggleBlockUserUseCase : IToggleBlockUserUseCase
    ){
        this.#_toggleBlockUserUseCase = toggleBlockUserUseCase;
    }

    blockUser = async (
        call : ServerUnaryCall<BlockUserRequest,Empty>,
        callback : sendUnaryData<Empty>
    ) : Promise<void> => {
        const { userId, block } = call.request; // Extract context: userId and the desired block status (block: true/false)
        const operation = block ? 'BLOCK' : 'UNBLOCK';

        try {
            // Log 1: Request received
            logger.info(`gRPC Admin handler received ${operation} user request`, { userId, block });

            const result = await this.#_toggleBlockUserUseCase.execute(call.request);

            if(!result.success){
                // Log 2A: UseCase failure
                logger.warn(`${operation} user UseCase failed`, { 
                    userId, 
                    block,
                    message: result.message 
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success
            logger.info(`${operation} user UseCase succeeded`, { 
                userId, 
                block,
                message: result.message || `${operation} successful` 
            });

            return callback(null,{});
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error(`gRPC Admin handler failed with internal error during ${operation} operation`, { 
                userId, 
                block, 
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
     * This method ensures that the `blockUser` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound blockUser handler for gRPC wrapped in an object.
     */
    getServiceHandler() : Record<string, Function> {
        return {
            blockUser : this.blockUser.bind(this)
        }
    }
}