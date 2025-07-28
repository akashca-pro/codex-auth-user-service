import TYPES from "@/config/inversify/types";
import container from "@/config/inversify/container";
import logger from "@akashcapro/codex-shared-utils/dist/utils/logger";
import { AuthAdminServiceService, AuthUserServiceService } from "@akashcapro/codex-shared-utils";
import { Server, ServerCredentials } from "@grpc/grpc-js"
import { config } from "@/config";

import { GrpcAuthHandler } from "./handlers/common/AuthHandler";

import { GrpcUserSignupHandler } from "./handlers/user/signupHandler";

const authHandler = container.get<GrpcAuthHandler>(TYPES.GrpcAuthHandler);

// for users 
const signupHandler = container.get<GrpcUserSignupHandler>(TYPES.GrpcUserSignupHandler);

const adminHandlers = {
    ...authHandler.getServiceHandler(),
}

const userHandlers = {
    ...signupHandler.getServiceHandler(),
}

export const startGrpcServer = () => {

    const server = new Server();

    server.addService(
        AuthAdminServiceService, adminHandlers);

    server.addService(
        AuthUserServiceService, userHandlers);
    

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