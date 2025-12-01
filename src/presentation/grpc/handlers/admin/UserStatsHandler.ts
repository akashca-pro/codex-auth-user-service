import { UserStatsUseCase } from "@/app/useCases/admin/implementation/userStat.usecase";
import TYPES from "@/config/inversify/types";
import { SystemErrorType } from "@/domain/enums/ErrorType";
import { mapMessageToGrpcStatus } from "@/utils/GrpcStatusCode";
import logger from "@/utils/logger";
import { UserStatsResponse } from "@akashcapro/codex-shared-utils";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { inject, injectable } from "inversify";


@injectable()
export class GrpcAdminUserStats {
    #_userStatsUseCase : UserStatsUseCase

    constructor(
        @inject(TYPES.UserStatsUseCase) userStatsUseCase : UserStatsUseCase
    ){
        this.#_userStatsUseCase = userStatsUseCase
    }

    userStats = async (
        call : ServerUnaryCall<Empty,UserStatsResponse>,
        callback : sendUnaryData<UserStatsResponse>
    ) : Promise<void> => {
        try {
            logger.info('gRPC Admin handler received user stats request');

            const result = await this.#_userStatsUseCase.execute();

            if(!result.success){
                logger.warn('UserStatsUseCase failed', { message: result.message });
                return callback({
                    code : mapMessageToGrpcStatus(result.message!),
                    message : result.message
                },null)
            }

            logger.info('UserStatsUseCase succeeded', { stats: result.data });

            return callback(null,{
                totalUsers : result.data.totalUsers,
                todaysUsers : result.data.todaysUsers
            })
        } catch (error : any) {
            logger.error('gRPC Admin handler failed with internal error during user stats fetch', { error });
            return callback({
                code : status.INTERNAL,
                message : SystemErrorType.InternalServerError
            },null);
        }
    }

    getServiceHandler() : Record<string, Function> {
        return {
            userStats : this.userStats.bind(this)
        }
    }

}