import { IUpdateUserProfileUseCase } from "@/app/useCases/User/UpdateProfileUseCase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger"; // baseLogger imported as logger
import { UpdateProfileRequest, UpdateProfileResponse } from "@akashcapro/codex-shared-utils";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Grpc Handler for update profile use case.
 * * @class
 */
@injectable()
export class GrpcUpdateProfileHandler {

    #updateProfileUseCase : IUpdateUserProfileUseCase
    
    /**
     * * @param {IUpdateUserProfileUseCase} updateProfileUseCase
     * @constructor
     */
    constructor(
        @inject(TYPES.UpdateProfileUseCase) updateProfileUseCase : IUpdateUserProfileUseCase
    ){
        this.#updateProfileUseCase = updateProfileUseCase
    }

    updateProfile = async (
        call : ServerUnaryCall<UpdateProfileRequest,UpdateProfileResponse>,
        callback : sendUnaryData<UpdateProfileResponse>
    ) => {

        try {
            // Log 1: Request received
            logger.info('gRPC handler received update profile request', { request: call.request });

            const result = await this.#updateProfileUseCase.execute(call.request);
            
            if(!result.success){
                // Log 2A: UseCase failure
                logger.warn('Update profile UseCase failed', { 
                    message: result.message,
                    request: call.request
                });

                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }
            
            // Log 2B: UseCase success
            logger.info('Update profile UseCase succeeded', { 
                message: result.message || 'Profile updated successfully'
            });
            return callback(null,{
                updatedData : result.data ? result.data : null,
                message : result.message!
            });
        } catch (error : any) {
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

    /**
     * Returns the bound handler method for the gRPC service.
     *
     * @remarks
     * This method ensures that the `profile` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            updateProfile : this.updateProfile.bind(this)
        } 
    }

}