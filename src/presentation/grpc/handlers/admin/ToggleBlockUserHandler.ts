import { IToggleBlockUserUseCase } from "@/app/useCases/admin/toggleBlockUser.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger";
import { BlockUserRequest } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class for handling list users.
 * 
 * @class
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
        try {
            const req = call.request;
            const result = await this.#_toggleBlockUserUseCase.execute(req);
            if(!result.success){
                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }
            return callback(null,{});
        } catch (error) {
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