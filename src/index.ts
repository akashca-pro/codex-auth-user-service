import logger from '@/utils/logger';
import { config } from '@/config';
import { startGrpcServer } from '@/presentation/grpc/server';
import dotenv from 'dotenv';
import { startMetricsServer } from './config/metrics/metrics-server';
dotenv.config();

const startServer = () => {
    try {
        // Start prometheus metrics server.
        startMetricsServer(config.AUTH_USER_SERVICE_METRICS_PORT);

        // start gRPC server.
        startGrpcServer();
    } catch (error) {
        logger.error('Failed to start server : ',error);
        process.exit(1);
    }
}

startServer();