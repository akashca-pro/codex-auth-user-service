import { ResponseDTO } from "@/domain/dtos/Response";
import { OAuthLoginRequest } from "@akashcapro/codex-shared-utils";

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
     * @param request - The request payload contains user data from oAuth provider.
     * @returns {Promise<ResponseDTO>} - The response data. 
     * 
     * @remarks
     * This method is responsible for handling the logic of authenticating an oAuth user
     * based on the provided credentials.
     */
    execute(request : OAuthLoginRequest) : Promise<ResponseDTO>;

}