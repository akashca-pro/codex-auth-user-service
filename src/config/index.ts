import dotenv from 'dotenv';
dotenv.config();

interface Config {
    DATABASE_URL : string
    PORT : number;
    REDIS_URL : string;
    SERVICE_NAME : string;
    NODEMAILER_EMAIL : string;
    NODEMAILER_PASS : string;
    ACCESS_TOKEN_SECRET : string;
    REFRESH_TOKEN_SECRET : string;
    GRPC_SERVER_URL : string;
    JWT_REFRESH_TOKEN_EXPIRY : string;
    JWT_ACCESS_TOKEN_EXPIRY : string;
    NODEMAILER_SERVICE : string;
    OTP_EXPIRY_SECONDS : number;
    METRICS_PORT : number;
    PROFILE_CACHE_EXPIRY : number;
}

export const config : Config = {
     DATABASE_URL : process.env.DATABASE_URL || 'db_url',
     ACCESS_TOKEN_SECRET : process.env.JWT_ACCESS_TOKEN_SECRET || 'jwt_secret',
     REFRESH_TOKEN_SECRET : process.env.JWT_REFRESH_TOKEN_SECRET || 'jwt_secret',
     PORT : Number(process.env.PORT) || 3001,
     REDIS_URL : process.env.REDIS_URL || 'redis_url',
     SERVICE_NAME :  'auth-user-service',
     NODEMAILER_EMAIL : process.env.NODEMAILER_EMAIL || '',
     NODEMAILER_PASS : process.env.NODEMAILER_PASS || '',
     GRPC_SERVER_URL : process.env.GRPC_SERVER_URL || '0.0.0.0:50051',
     JWT_ACCESS_TOKEN_EXPIRY : process.env.JWT_ACCESS_TOKEN_EXPIRY || '1d',
     JWT_REFRESH_TOKEN_EXPIRY : process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
     NODEMAILER_SERVICE : process.env.NODEMAILER_SERVICE || 'gmail',
     OTP_EXPIRY_SECONDS : Number(process.env.OTP_EXPIRY_SECONDS) || 120,
     METRICS_PORT : Number(process.env.METRICS_PORT) || 9101,
     PROFILE_CACHE_EXPIRY : Number(process.env.PROFILE_CACHE_EXPIRY) || 86400
}