import { IAuthenticateLocalAuthUserDTO } from "@/domain/dtos/Authenticate/AuthenticateUser";
import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * Interface for the use case of authenticating a user.
 *
 * This interface defines the contract for a use case responsible for authenticating
 * a user based on the provided credentials.
 *
 * @interface
 */
export interface IAuthenticateLocalAuthUserUseCase {

    /**
     * @async
     * @param {IAuthenticateLocalAuthUserDTO} credentials - The user credentials for authentication.
     * @returns {Promise<ResponseDTO>} - The response data 
     * 
     * @remarks
     * This method is responsible for handling the logic of authenticating a user
     * based on the provided credentials (email and password).
     */
    execute({email, password} : IAuthenticateLocalAuthUserDTO ) : Promise<ResponseDTO> 
}