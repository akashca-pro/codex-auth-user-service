import { IOtpService } from "@/app/providers/GenerateAndSendOtp";
import { config } from "@/config";
import TYPES from "@/config/inversify/types";
import { OtpType } from "@/domain/enums/OtpType";
import { injectable } from "inversify";
import Redis from "ioredis";
import { randomInt } from "node:crypto";
import { Transporter } from "nodemailer";
import { Logger } from 'winston';

/**
 * Provider for generating , sending and validating otps.
 * 
 * @class
 * @implements {IOtpService}
 */
export class OtpService implements IOtpService {

    /**
     * 
     * @param {Redis} redis - Redis client for caching the otp
     * @param {Transporter} mailer - Nodemailer instance for sending otp via mail.
     * @param {Logger} logger - Custom logger instance from winston
     * @param {number} otpTtlSeconds - Otp expiry time.
     */
    constructor(
        private readonly redis: Redis,
        private readonly mailer: Transporter,
        private readonly logger: Logger,
        private readonly otpTtlSeconds: number = config.OTP_EXPIRY_SECONDS
    ){}

    /**
     * Generate random 6 digit code by crpto module.
     * 
     * @async
     * @returns {string} - Random 6 digit code.
      */
    private async generateOtp(): Promise<string> {
        return randomInt(100000, 999999).toString();
    }

    /**
     * Cache otp in cache store for {otpTtlSeconds}.
     * 
     * @async
     * @param {string} email - The email of the user. 
     * @param {OtpType} type - The type of the otp.
     * @param {string} otp - The otp of the user.
     */
    private async cacheOtp(email: string, type: OtpType, otp: string): Promise<void> {
        const key = `otp:${type}:${email}`;
        try {
        await this.redis.set(key, otp, 'EX', this.otpTtlSeconds);
        } catch (error) {
        this.logger.error(`Error caching OTP: ${error}`);
        throw new Error('Failed to cache OTP');
        }
    }

    /**
     * Compare otp from the user with stored otp in the cache store.
     * 
     * @async
     * @param {string} email - The email of the user. 
     * @param {OtpType} type - The type of the otp.
     * @param {string} otp - The otp of the user.
     * @returns {boolean} - The result of verification of the otp.
     */
    async verifyOtp(email: string, type: OtpType, otp: string): Promise<boolean> {
        const key = `otp:${type}:${email}`;
        try {
        const storedOtp = await this.redis.get(key);
        if (!storedOtp) {
            return false;
        }
        return storedOtp === otp;
        } catch (error) {
        this.logger.error(`Error verifying OTP: ${error}`);
        return false;
        }
    }

    /**
     * Clear otp from the cache store.
     * 
     * @async
     * @param {string} email - The email of the user. 
     * @param {OtpType} type - The type of the otp.
     */
    async clearOtp(email: string, type: OtpType): Promise<void> {
        const key = `otp:${type}:${email}`;
        try {
        await this.redis.del(key);
        } catch (error) {
        this.logger.error(`Error clearing OTP: ${error}`);
        throw new Error('Failed to clear OTP');
        }
    }

    /**
     * Generate and send otp via email.
     * 
     * @async
     * @param {string} email - The email of the user. 
     * @param {OtpType} type - The type of the otp.
     */
    async generateAndSendOtp(email: string, type: OtpType): Promise<void> {
        const otp = await this.generateOtp();
        await this.cacheOtp(email, type, otp);
        await this.sendOtpEmail(email, otp);
    }

    /**
     * Sends the otp via email.
     * 
     * @async
     * @param {string} email - The email of the user.
     * @param {string} otp - The otp of the user.
     */
    private async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
        from: config.NODEMAILER_EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 1 minute.`,
        };

        try {
        await this.mailer.sendMail(mailOptions);
        } catch (error) {
        this.logger.error(`Error sending OTP email: ${error}`);
        throw new Error('Failed to send OTP email');
        }
    }

}
