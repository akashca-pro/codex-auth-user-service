import { ISignUpUserUseCase } from "@/app/useCases/User/SignupUserUseCase";
import TYPES from "@/config/inversify/types";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { UserRole } from "@/domain/enums/UserRole";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import { SignupRequest, SignupResponse } from "@akashcapro/codex-shared-utils";
import logger from '@/utils/logger';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";
import { grpcMetricsCollector } from "@/helpers/grpcMetricsCollector";


/**
 * Class for handling user signup.
 * 
 * @class
 */
@injectable()
export class GrpcUserSignupHandler {

    /**
     * 
     * @param {ISignUpUserUseCase} signUpUserUseCase - The Usecase for creation of the user.
     * @constructor
     */
    constructor(
        @inject(TYPES.SignUpUserUseCase)
        private signUpUserUseCase : ISignUpUserUseCase
    ){}

    /**
     * This method handles the signup user use case.
     * 
     * @async
     * @param {ServerUnaryCall} call - This contain the request from the grpc. 
     * @param {sendUnaryData} callback - The sends the grpc response.
     */
    signup = async (
        call : ServerUnaryCall<SignupRequest,SignupResponse>,
        callback : sendUnaryData<SignupResponse>
    ) : Promise<void> => {

        const startTime = Date.now(); // for latency
        const method = 'signup'

        try {
            const req = call.request;
            const userData = UserMapper.toCreateLocalAuthUserDTO(req,UserRole.USER);
            const result = await this.signUpUserUseCase.execute(userData);
        
            if(!result.success){
                grpcMetricsCollector(method,result.data.message,startTime)

                return callback({
                    code : mapMessageToGrpcStatus(result.data.message),
                    message : result.data.message
                },null)
            }

            grpcMetricsCollector(method,result.data.message,startTime)

            return callback(null,result.data);

        } catch (error : any) {

            logger.error(SystemErrorType.InternalServerError,error);
            grpcMetricsCollector(method,error.message,startTime)

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
     * This method ensures that the `signup` handler maintains the correct `this` context
     * when passed to the gRPC server. This is especially important since gRPC handlers
     * are called with a different execution context.
     *
     * @returns {object} The bound login handler for gRPC wrapped in an object.
     */
    getServiceHandler(): object{
        return {
            signup : this.signup.bind(this)
        } 
    }

}