import { OtpType } from "@/domain/enums/OtpType";

export const validateOtpType = (type : string) : OtpType => {
    if(type.toUpperCase() === 'SIGNUP') return OtpType.SIGNUP
    if(type.toUpperCase() === 'FORGOT_PASS') return OtpType.FORGOT_PASS
    if(type.toUpperCase() === 'CHANGE_EMAIL') return OtpType.CHANGE_EMAIL
    throw new Error();
}