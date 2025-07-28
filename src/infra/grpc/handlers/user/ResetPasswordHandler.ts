import { IResetPasswordUseCase } from "@/app/useCases/Authentication/ResetPasswordUseCase";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { ChangePasswordRequest, ChangePasswordResponse } from "@akashcapro/codex-shared-utils";
import logger from "@akashcapro/codex-shared-utils/dist/utils/logger";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { injectable } from "inversify";


/**
 * Class for handling forgot password.
 * 
 * @class
 */
@injectable()
export class GrpcUserResetPasswordHandler {

    /**
     * 
     * @param {IResetPasswordUseCase} resetPasswordUseCase - The Usecase for creation of the user.
     * @constructor 
     */
    constructor(
        private resetPasswordUseCase : IResetPasswordUseCase
    ){}

    /**
     * This method handles the resetPassword use case.
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    changePassword = async(
        call : ServerUnaryCall<ChangePasswordRequest,ChangePasswordResponse>,
        callback : sendUnaryData<ChangePasswordResponse>
    ) => {

        try {
            
            const req = call.request;

            const result = await this.resetPasswordUseCase.execute({
                email : req.email,
                newPassword : req.newPassword,
                otp : req.otp
            })

            if(!result.success){
                return callback({
                    code : mapMessageToGrpcStatus(result.data.message),
                    message : result.data.message
                },null)
            }

            return callback(null,result.data.message);

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