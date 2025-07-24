import { OtpType } from "@/domain/enums/OtpType"

/**
 * Interface provides the otp service which handles 
 * otp generation, verification and clearing
 * 
 * @interface
 */
export interface IOtpService {

    /**
     * Generate and send otp for specific requirement to the user
     * 
     * @param {string} email 
     * @param {OtpType} type 
     * @returns {Promise<void>}
     */
    generateAndSendOtp(email : string, type : OtpType) : Promise<void>

    /**
     * Verify Otp that sent to the user based on the type
     * 
     * @param {string} email 
     * @param {OtpType} type 
     * @param {string} otp
     * @returns {Promise<boolean>}
     */
    verifyOtp(email : string, type : OtpType, otp : string) : Promise<boolean>

    /**
     * Clear otp the sent to the user
     * 
     * @param {string} email 
     * @param {string} type 
     * @return {Promise<void>}
     */
    clearOtp(email : string, type : OtpType) : Promise<void> 

}