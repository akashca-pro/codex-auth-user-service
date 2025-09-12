import { OtpType } from "@/domain/enums/OtpType"

/**
 * Interface provides the otp service which handles 
 * otp generation, verification and clearing
 * 
 * @interface
 */
export interface IOtpService {

    /**
     * Generate and send otp for specific requirement to the user.
     * 
     * @async
     * @param {string} email - The email of the requesting user.
     * @param {OtpType} type - The type of the otp based on request.
     * @returns {Promise<void>}
     */
    generateAndSendOtp(email : string, type : OtpType) : Promise<void>

    /**
     * Verify Otp that sent to the user based on the type.
     * 
     * @async
     * @param {string} email - The email of the requesting user.
     * @param {OtpType} type - The type of the otp based on request.
     * @param {string} otp - The otp which sent to the user via email.
     * @returns {Promise<boolean>}
     */
    verifyOtp(email : string, type : OtpType, otp : string) : Promise<boolean>

    /**
     * Clear otp the sent to the user.
     * 
     * @async
     * @param {string} email - The email of the requesting user.
     * @param {OtpType} type - The type of the otp based on request.
     * @return {Promise<void>}
     */
    clearOtp(email : string, type : OtpType) : Promise<void> 

}