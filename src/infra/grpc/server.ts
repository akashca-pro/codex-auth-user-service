import TYPES from "@/config/inversify/types";
import container from "@/config/inversify/container";
import logger from '@/utils/logger';
import { AuthAdminServiceService, AuthUserServiceService } from "@akashcapro/codex-shared-utils";
import { Server, ServerCredentials } from "@grpc/grpc-js"
import { config } from "@/config";

import { GrpcAuthHandler } from "./handlers/common/AuthHandler";

import { GrpcUserSignupHandler } from "./handlers/user/SignupHandler";
import { GrpcUserVerifySignupOtpHandler } from "./handlers/user/VerifyOtpHandler";
import { GrpcUserResendOtpHandler } from "./handlers/user/ResendOtpHandler";
import { GrpcUserForgotPasswordHandler } from "./handlers/user/ForgotPasswordHandler";
import { GrpcUserResetPasswordHandler } from "./handlers/user/ResetPasswordHandler";
import { GrpcOAuthHandler } from "./handlers/common/OAuthHandler";
import { GrpcRefreshTokenHandler } from "./handlers/common/RefreshTokenHandler";
import { GrpcProfileHandler } from "./handlers/common/ProfileHandler";

// common
const authHandler = container.get<GrpcAuthHandler>(TYPES.GrpcAuthHandler);
const oAuthHandler = container.get<GrpcOAuthHandler>(TYPES.GrpcOAuthHandler);
const refreshToken = container.get<GrpcRefreshTokenHandler>(TYPES.GrpcRefreshTokenHandler);

// users 
const userSignupHandler = container.get<GrpcUserSignupHandler>(TYPES.GrpcUserSignupHandler);
const userVerifySignupOtpHandler = container.get<GrpcUserVerifySignupOtpHandler>(TYPES.GrpcUserVerifySignupOtpHandler);
const userResendOtpHandler = container.get<GrpcUserResendOtpHandler>(TYPES.GrpcUserResendOtpHandler);
const userForgotPasswordHandler = container.get<GrpcUserForgotPasswordHandler>(TYPES.GrpcUserForgotPasswordHandler);
const userResetPasswordHandler = container.get<GrpcUserResetPasswordHandler>(TYPES.GrpcUserResetPasswordHandler);
const userProfileHandler = container.get<GrpcProfileHandler>(TYPES.GrpcProfileHandler);

const adminHandlers = {
    ...authHandler.getServiceHandler(),
    ...refreshToken.getServiceHandler()
}

const userHandlers = {
    ...authHandler.getServiceHandler(),
    ...oAuthHandler.getServiceHandler(),
    ...refreshToken.getServiceHandler(),
    ...userSignupHandler.getServiceHandler(),
    ...userVerifySignupOtpHandler.getServiceHandler(),
    ...userResendOtpHandler.getServiceHandler(),
    ...userForgotPasswordHandler.getServiceHandler(),
    ...userResetPasswordHandler.getServiceHandler(),

    ...userProfileHandler.getServiceHandler()
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