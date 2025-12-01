import { IListUsersUseCase } from "@/app/useCases/admin/listUsers.usecase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import logger from "@/utils/logger"; // baseLogger imported as logger
import { ListUsersRequest, ListUsersResponse } from "@akashcapro/codex-shared-utils";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class for handling list users.
 * * @class
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
        const { page, limit } = call.request; // Extract pagination/filter info for context

        try {
            // Log 1: Request received
            logger.info('gRPC Admin handler received list users request', { page, limit });

            const result = await this.#_listUsersUseCase.execute(call.request);

            // Log 2: UseCase success
            logger.info('List users UseCase succeeded', { 
                page: result.currentPage, 
                limit: limit, 
                totalItems: result.totalItems,
                totalPages: result.totalPages
            });

            return callback(null,{
                users : result.body,
                currentPage : result.currentPage,
                totalItems : result.totalItems,
                totalPage : result.totalPages
            })
        } catch (error : any) {
            // Log 3: Uncaught internal error
            logger.error('gRPC Admin handler failed with internal error during user listing', { 
                page, 
                limit, 
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