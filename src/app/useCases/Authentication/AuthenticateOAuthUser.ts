import { IAuthenticateOAuthUserDTO } from "@/domain/dtos/Authenticate/AuthenticateUser";
import { ResponseDTO } from "@/domain/dtos/Response";

/**
 * Interface for the use case of authenticating an oAuth user.
 *
 * This interface defines the contract for a use case responsible for authenticating
 * an oAuth user based on the provided credentials.
 *
 * @interface
 */
export interface IAuthenticateOAuthUserUseCase {

    /**
     * Execute the authenticate oauth usecase.
     * 
     * @async
     * @param {IAuthenticateOAuthUserDTO} credentials 
     * 
     * @remarks
     * This method is responsible for handling the logic of authenticating an oAuth user
     * based on the provided credentials.
     */
    execute({
        email,
        oAuthId,
        firstName,
        username,
    } : IAuthenticateOAuthUserDTO ) : Promise<ResponseDTO>;

}