import { IAuthenticateLocalAuthUserDTO } from "@/domain/dtos/Authenticate/AuthenticateUser";
import { ResponseDTO } from "@/domain/dtos/Response";
import { LoginRequest } from "@akashcapro/codex-shared-utils";

/**
 * Interface for the use case of authenticating a local auth user.
 *
 * This interface defines the contract for a use case responsible for authenticating
 * a local auth user based on the provided credentials.
 *
 * @interface
 */
export interface IAuthenticateLocalAuthUserUseCase {

    /**
     * executes the authentication usecase.
     * 
     * @async
     * @param request - Request payload to authenticate user.
     * @returns {Promise<ResponseDTO>} - The response data 
     * 
     * @remarks
     * This method is responsible for handling the logic of authenticating a user
     * based on the provided credentials (email and password).
     */
    execute(
       request : LoginRequest
    ) : Promise<ResponseDTO> 
}