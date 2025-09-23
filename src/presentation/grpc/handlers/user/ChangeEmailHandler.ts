import { IChangeEmailUseCase } from "@/app/useCases/User/ChangeEmail.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger";
import { ChangeEmailRequest } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class handling the change email usecase.
 * 
 * @class
 */
@injectable()
export class GrpcChangeEmailHandler {

    #_changeEmailUseCase : IChangeEmailUseCase

    constructor(
        @inject(TYPES.ChangeEmailUseCase) changeEmailUseCase : IChangeEmailUseCase
    ){
        this.#_changeEmailUseCase = changeEmailUseCase
    }

    changeEmail = async(
        call : ServerUnaryCall<ChangeEmailRequest, Empty>,
        callback : sendUnaryData<Empty>
    ) => {
        try {
            const result = await this.#_changeEmailUseCase.execute(call.request);
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
     * This method ensures that the `changeEmail` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            changeEmail : this.changeEmail.bind(this)
        } 
    }

}