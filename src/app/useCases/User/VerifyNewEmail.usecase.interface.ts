import { ResponseDTO } from "@/domain/dtos/Response";
import { IVerifyNewEmailRequestDTO } from "@/domain/dtos/User/VerifyNewEmail.dto";

/**
 * Interface defines the contract for the verify new email use case.
 * 
 * @interface
 */
export interface IVerifyNewEmailUseCase {

    /**
     * Executes the verify new email usecase.
     * 
     * @param {IVerifyNewEmailRequestDTO} payload - The payload contain email and otp.
     */
    execute(
        userId : string,
        payload : IVerifyNewEmailRequestDTO
    ) : Promise<ResponseDTO>

}