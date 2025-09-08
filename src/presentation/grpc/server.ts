import TYPES from "@/config/inversify/types";
import container from "@/config/inversify/container";
import logger from '@/utils/logger';
import { AuthAdminServiceService, AuthUserServiceService } from "@akashcapro/codex-shared-utils";
import { Server, ServerCredentials } from "@grpc/grpc-js"
import { config } from "@/config";

import { GrpcUserAuthHandler } from "./handlers/user/UserAuthHandler";

import { GrpcUserSignupHandler } from "./handlers/user/SignupHandler";
import { GrpcUserVerifySignupOtpHandler } from "./handlers/user/VerifySignupOtpHandler";
import { GrpcUserResendOtpHandler } from "./handlers/user/ResendOtpHandler";
import { GrpcUserForgotPasswordHandler } from "./handlers/user/ForgotPasswordHandler";
import { GrpcUserResetPasswordHandler } from "./handlers/user/ResetPasswordHandler";
import { GrpcOAuthHandler } from "./handlers/user/OAuthHandler";
import { GrpcRefreshTokenHandler } from "./handlers/common/RefreshTokenHandler";
import { GrpcProfileHandler } from "./handlers/common/ProfileHandler";
import { GrpcAdminAuthHandler } from "./handlers/admin/AdminAuthHandler";
import { GrpcUpdateProfileHandler } from "./handlers/common/UpdateProfileHandler";
import { grpcMetricsCollector } from "@/config/metrics/grpcMetricsMiddleware";
import { GrpcAdminListUsersHandler } from "./handlers/admin/ListUsersHandler";

// common
const refreshToken = container.get<GrpcRefreshTokenHandler>(TYPES.GrpcRefreshTokenHandler);
const updateProfile = container.get<GrpcUpdateProfileHandler>(TYPES.GrpcUpdateProfileHandler);

// users 
const userAuthHandler = container.get<GrpcUserAuthHandler>(TYPES.GrpcUserAuthHandler);
const oAuthHandler = container.get<GrpcOAuthHandler>(TYPES.GrpcOAuthHandler);
const userSignupHandler = container.get<GrpcUserSignupHandler>(TYPES.GrpcUserSignupHandler);
const userVerifySignupOtpHandler = container.get<GrpcUserVerifySignupOtpHandler>(TYPES.GrpcUserVerifySignupOtpHandler);
const userResendOtpHandler = container.get<GrpcUserResendOtpHandler>(TYPES.GrpcUserResendOtpHandler);
const userForgotPasswordHandler = container.get<GrpcUserForgotPasswordHandler>(TYPES.GrpcUserForgotPasswordHandler);
const userResetPasswordHandler = container.get<GrpcUserResetPasswordHandler>(TYPES.GrpcUserResetPasswordHandler);
const userProfileHandler = container.get<GrpcProfileHandler>(TYPES.GrpcProfileHandler);

// admin
const adminAuthHandler = container.get<GrpcAdminAuthHandler>(TYPES.GrpcAdminAuthHandler);
const adminListUsersHandler = container.get<GrpcAdminListUsersHandler>(TYPES.GrpcAdminListUsersHandler);

function wrapAll(serviceObj : Record<string,Function> ){
    return Object.fromEntries(
        Object.entries(serviceObj).map(([name, fn])=>[
            name,
            grpcMetricsCollector(name, fn)
        ])
    )
}

const adminHandlers = wrapAll({
    ...adminAuthHandler.getServiceHandler(),
    ...refreshToken.getServiceHandler(),
    ...updateProfile.getServiceHandler(),
    ...adminListUsersHandler.getServiceHandler(),
});

const userHandlers = wrapAll({
    ...userAuthHandler.getServiceHandler(),
    ...oAuthHandler.getServiceHandler(),
    ...refreshToken.getServiceHandler(),
    ...userSignupHandler.getServiceHandler(),
    ...userVerifySignupOtpHandler.getServiceHandler(),
    ...userResendOtpHandler.getServiceHandler(),
    ...userForgotPasswordHandler.getServiceHandler(),
    ...userResetPasswordHandler.getServiceHandler(),

    ...userProfileHandler.getServiceHandler(),
    ...updateProfile.getServiceHandler()

})

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