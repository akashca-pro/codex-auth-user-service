import { IUpdateUserProfileUseCase } from "@/app/useCases/User/UpdateProfileUseCase.interface";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger";
import { UpdateProfileRequest, UpdateProfileResponse } from "@akashcapro/codex-shared-utils";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";

/**
 * Grpc Handler for update profile use case.
 * 
 * @class
 */
@injectable()
export class GrpcUpdateProfileHandler {

    #updateProfileUseCase : IUpdateUserProfileUseCase
    
    /**
     * 
     * @param {IUpdateUserProfileUseCase} updateProfileUseCase
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
            const result = await this.#updateProfileUseCase.execute(call.request);
            if(!result.success){
                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }
            return callback(null,{
                message : result.message!
            });
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