import { ResponseDTO } from "@/domain/dtos/Response";
import { ICreateOAuthUserRequestDTO } from "@/domain/dtos/User/CreateUser";

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
     * @param {IAuthenticateOAuthUserDTO} data 
     * @returns {Promise<ResponseDTO>} - The response data. 
     * 
     * @remarks
     * This method is responsible for handling the logic of authenticating an oAuth user
     * based on the provided credentials.
     */
    execute(data : ICreateOAuthUserRequestDTO ) : Promise<ResponseDTO>;

}