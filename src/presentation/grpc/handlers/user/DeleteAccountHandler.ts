import { IDeleteAccountUseCase } from "@/app/useCases/User/DeleteAccount.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger";
import { DeleteAccountRequest } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class handling the delete account usecase.
 * 
 * @class
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
        try {
            const req = call.request;
            const result = await this.#_deleteAccountUseCase.execute(
                req.userId,
                req.password
            )

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