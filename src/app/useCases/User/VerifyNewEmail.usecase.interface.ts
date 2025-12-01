import { ResponseDTO } from "@/domain/dtos/Response";
import { VerifyNewEmailRequest } from "@akashcapro/codex-shared-utils";

/**
 * Interface defines the contract for the verify new email use case.
 * 
 * @interface
 */
export interface IVerifyNewEmailUseCase {

    /**
     * Executes the verify new email usecase.
     * 
     * @param request - The Request payload contain email and otp.
     */
    execute(
        request : VerifyNewEmailRequest
    ) : Promise<ResponseDTO>
}