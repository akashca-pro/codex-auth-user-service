import { IProfileUseCase } from "@/app/useCases/User/ProfileUserUseCase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { UserProfileRequest, UserProfileResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


/**
 * Class for handling Profile use case.
 * 
 * @class
 */
@injectable()
export class GrpcProfileHandler {

    #_profileUseCase : IProfileUseCase

    constructor(
        @inject(TYPES.ProfileUseCase) profileUseCase : IProfileUseCase
    ){
        this.#_profileUseCase = profileUseCase;
    }

    /**
     * This method handles the profile use case.
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    profile = async (
        call : ServerUnaryCall<UserProfileRequest,UserProfileResponse>,
        callback : sendUnaryData<UserProfileResponse>
    ) => {
        try {
            const req = call.request; 
            const result = await this.#_profileUseCase.execute(req.userId);
            if(!result.success){
                return callback({
                    code : mapMessageToGrpcStatus(result.message),
                    message : result.message
                },null)
            }
            return callback(null,{ 
                ...result.data
             });

        } catch (error : any ) {
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
            profile : this.profile.bind(this)
        } 
    }

}

