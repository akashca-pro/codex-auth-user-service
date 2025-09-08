import { IListUsersUseCase } from "@/app/useCases/admin/ListUsersUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import logger from "@/utils/logger";
import { ListUsersRequest, ListUsersResponse } from "@akashcapro/codex-shared-utils";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class for handling list users.
 * 
 * @class
 */
@injectable()
export class GrpcAdminListUsersHandler {

    #_listUsersUseCase : IListUsersUseCase

    constructor(
        @inject(TYPES.ListUsersUseCase) listUsersUseCase : IListUsersUseCase
    ){
        this.#_listUsersUseCase = listUsersUseCase
    }

    listUsers = async (
        call : ServerUnaryCall<ListUsersRequest,ListUsersResponse>,
        callback : sendUnaryData<ListUsersResponse>
    ) : Promise<void> => {
        try {
            const req = call.request;
            const result = await this.#_listUsersUseCase.execute(req);
            return callback(null,{
                users : result.body,
                currentPage : result.currentPage,
                totalItems : result.totalItems,
                totalPage : result.totalPages
            })
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
     * This method ensures that the `listUsers` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound listUsers handler for gRPC wrapped in an object.
     */
    getServiceHandler() : Record<string, Function> {
        return {
            listUsers : this.listUsers.bind(this)
        }
    }

}