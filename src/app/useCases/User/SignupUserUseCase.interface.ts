import { ResponseDTO } from "@/domain/dtos/Response";
import { ICreateLocalUserRequestDTO } from "@/domain/dtos/User/CreateUser";

/**
 * Interface for the use case of creating a new user.
 *
 * This interface defines the contract for a use case responsible for creating
 * a user and sent otp for verification.
 *
 * @interface
 */
export interface ISignUpUserUseCase {

    /**
     * Execute the create user use case.
     * 
     * @async
     * @param {ICreateLocalUserRequestDTO} data - The data for creating a new user.
     * @returns {ResponseDTO}
     * 
     * @remarks
     * This method is responsible for handling the logic of creation
     * of a new user.
     */
    execute(data : ICreateLocalUserRequestDTO) : Promise<ResponseDTO>

}
