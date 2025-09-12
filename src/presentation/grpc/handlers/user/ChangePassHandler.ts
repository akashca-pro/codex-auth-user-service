import { IChangePassUseCase } from "@/app/useCases/User/ChangePass.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger";
import { ChangePasswordRequest } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Class handling the change password usecase.
 * 
 * @class
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
        try {
            const req = call.request;
            const result = await this.#_changePassUseCase.execute(req.userId,{
                currPass : req.currPass,
                newPass : req.newPass
            })

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