import TYPES from "@/config/inversify/types";
import { injectable, inject } from "inversify";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IAuthenticateOAuthUserUseCase } from "../AuthenticateOAuthUser";
import { IUserRepository } from "@/domain/repository/User";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { User } from "@/domain/entities/User";
import { OAuthAuthentication } from "@/domain/valueObjects/UserAuthentication";
import { AuthProvider } from "@/domain/enums/AuthProvider"; 
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { ICreateOAuthUserRequestDTO } from "@/domain/dtos/User/CreateUser";
import { randomUUID } from "node:crypto";
import { IUserInRequestDTO } from "@/domain/dtos/User/UserIn";
import { generateUniqueUsername } from "@/utils/generateRandomUsername";
import { AuthenticateUserErrorType } from "@/domain/enums/authenticateUser/ErrorType";
import { UserMapper } from "@/domain/dtos/mappers/UserMapper";
import { OAuthLoginRequest } from "@akashcapro/codex-shared-utils";
import { UserRole } from "@/domain/enums/UserRole";

/**
 * Use case for authenticating a user.
 * 
 * @class
 * @implements {IAuthenticateOAuthUserUseCase}
 */
@injectable()
export class AuthenticateOAuthUserUseCase implements IAuthenticateOAuthUserUseCase {

    #_userRepository : IUserRepository
    #_tokenProvider : ITokenProvider

    /**
     * Creates an instance of AuthenticateOAuthUserUseCase.
     * 
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {ITokenProvider} tokenProvider - Token service provider for generating token.
     * @contructor
     */
     constructor(
        @inject(TYPES.IUserRepository)
        userRepository : IUserRepository,

        @inject(TYPES.ITokenProvider)
        tokenProvider : ITokenProvider
     ){
        this.#_userRepository = userRepository,
        this.#_tokenProvider = tokenProvider
     }

    /**
     * Executes the oauth authentication use case.
     * 
     * @param {IAuthenticateOAuthUserDTO} data - The user credentials for authentication.
     * @return {Promise<ResponseDTO>} - The response data.
     */ 
    async execute(
        request : OAuthLoginRequest
    ): Promise<ResponseDTO> {

        const userData = UserMapper.toCreateOAuthUserDTO(request,UserRole.USER)
        const userAlreadyExists = await this.#_userRepository.findByEmail(userData.email);

        let user : IUserInRequestDTO

        if(!userAlreadyExists){

            const generateAvailableUsername = async (): Promise<string> => {
            let uniqueUsername: string;
            let usernameExists: boolean;

            do {
                uniqueUsername = generateUniqueUsername();
                usernameExists = await this.#_userRepository.findByUsername(uniqueUsername);
            } while (usernameExists);

            return uniqueUsername;
            };

            const uniqueUsername = await generateAvailableUsername();

            user = User.create({
                username : uniqueUsername,
                email : userData.email,
                authentication : new OAuthAuthentication(AuthProvider.GOOGLE, userData.oAuthId),
                firstName : userData.firstName,
                avatar : userData.avatar ?? null,
                country : null,
                lastName : null,
                role : userData.role
            })

            await this.#_userRepository.create(user);
        }else{
            user = userAlreadyExists as IUserInRequestDTO
        }

        if(user.isBlocked){
            return {
                data : null,
                message : AuthenticateUserErrorType.AccountBlocked,
                success : false
            }
        }        

        const payload : ITokenPayLoadDTO = {
            userId : user.userId,
            email : user.email,
            role : user.role,
            tokenId : randomUUID()
        }

        const accessToken = this.#_tokenProvider.generateAccessToken(payload);
        const refreshToken = this.#_tokenProvider.generateRefreshToken(payload);

        return { 
            data : { 
                accessToken,
                refreshToken,
                userInfo : {
                    userId : user.userId,
                    username : user.username,
                    email : user.email,
                    role : user.role,
                    avatar : user.avatar ?? null
                }
            },    
            message : UserSuccessType.GoogleAuthSuccess,
            success : true
        }
    }
}

