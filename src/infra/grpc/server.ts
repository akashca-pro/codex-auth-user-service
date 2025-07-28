import TYPES from "@/config/inversify/types";
import container from "@/config/inversify/container";
import logger from "@akashcapro/codex-shared-utils/dist/utils/logger";
import { AuthAdminServiceService } from "@akashcapro/codex-shared-utils";
import { Server, ServerCredentials } from "@grpc/grpc-js"
import { GrpcAdminAuthHandler } from "./handlers/admin/AuthHandler";
import { config } from "@/config";

const adminAuthHandler = container.get<GrpcAdminAuthHandler>(TYPES.GrpcAdminAuthHandler);

const adminHandlers = {
    ...adminAuthHandler.getServiceHandler(),
}

export const startGrpcServer = () => {

    const server = new Server();

    server.addService(
        AuthAdminServiceService, adminHandlers);

    server.bindAsync(
        config.GRPC_SERVER_URL,
        ServerCredentials.createInsecure(),
        (err,port) => {
            if(err) {
                logger.error('gRPC Server failed to start : ', err);
                return;
            }
            logger.info(`gRPC Server running on port ${port}`);
        }
    )

}