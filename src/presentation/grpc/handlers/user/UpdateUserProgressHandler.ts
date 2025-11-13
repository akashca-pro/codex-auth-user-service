import { IUpdateUserProgressUsecase } from "@/app/useCases/User/UpdateUserProgress.usecase.interface";
import TYPES from "@/config/inversify/types";
import { UpdateUserProgressRequest } from "@akashcapro/codex-shared-utils";
import { inject, injectable } from "inversify";
import logger from "@/utils/logger"; 
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";

@injectable()
export class GrpcUpdateUserProgressHandler {

    #_updateUserProgressUseCase : IUpdateUserProgressUsecase

    constructor(
        @inject(TYPES.UpdateUserProgressUseCase) updateUserProgressUseCase : IUpdateUserProgressUsecase
    ){
        this.#_updateUserProgressUseCase = updateUserProgressUseCase
    }

    updateUserProgress = async (
        call : ServerUnaryCall<UpdateUserProgressRequest,Empty>,
        callback : sendUnaryData<Empty>
    ) => {
        try {
            // Log 1: Request received
            logger.info('gRPC handler received update user progress request', { request: call.request });
            const result = await this.#_updateUserProgressUseCase.execute(call.request);
            if(!result.success){
                // Log 2A: UseCase failure
                logger.warn('Update user progress UseCase failed', { 
                    message: result.message,
                    request: call.request
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            // Log 2B: UseCase success
            logger.info('Update user progress UseCase succeeded', { 
                message: result.message || 'User progress updated successfully'
            });
            return callback(null,{});

        } catch (error) {
            // Log 3: Uncaught internal error
            logger.error('gRPC handler failed with internal error during profile update', { 
                error,
                request: call.request
            });
            
            return callback({
                code : status.INTERNAL,
                message : SystemErrorType.InternalServerError
            },null);
        }
    }
    getServiceHandler(): object{
        return {
            updateUserProgress : this.updateUserProgress.bind(this)
        } 
    }
}