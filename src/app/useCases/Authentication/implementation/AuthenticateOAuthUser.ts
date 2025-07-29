import TYPES from "@/config/inversify/types";
import { injectable, inject } from "inversify";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IAuthenticateOAuthUserUseCase } from "../AuthenticateOAuthUser";
import { IUserRepository } from "@/app/repository/User";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { User } from "@/domain/entities/User";
import { OAuthAuthentication } from "@/domain/valueObjects/UserAuthentication";
import { AuthProvider } from "@/domain/enums/AuthProvider"; 
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";
import { ICreateOAuthUserRequestDTO } from "@/domain/dtos/User/CreateUser";
import { randomUUID } from "node:crypto";

/**
 * Use case for authenticating a user.
 * 
 * @class
 * @implements {IAuthenticateOAuthUserUseCase}
 */
@injectable()
export class AuthenticateOAuthUserUseCase implements IAuthenticateOAuthUserUseCase {

    /**
     * Creates an instance of AuthenticateOAuthUserUseCase.
     * 
     * @param {IUserRepository} _userRepository - The repository of the user.
     * @param {ITokenProvider} _tokenProvider - Token service provider for generating token.
     * @contructor
     */
     constructor(
        @inject(TYPES.IUserRepository)
        private _userRepository : IUserRepository,

        @inject(TYPES.ITokenProvider)
        private _tokenProvider : ITokenProvider
     ){}

    /**
     * Executes the oauth authentication use case.
     * 
     * @param {IAuthenticateOAuthUserDTO} data - The user credentials for authentication.
     * @return {Promise<ResponseDTO>} - The response data.
     */ 
    async execute( data : ICreateOAuthUserRequestDTO): Promise<ResponseDTO> {
        
        try {
            const userAlreadyExists = await this._userRepository.findByEmail(data.email)

            if(userAlreadyExists){
                return {
                    data : { message : UserErrorType.UserAlreadyExists },
                    success : false
                }
            }

            const user = User.create({
                username : data.username,
                email : data.email,
                authentication : new OAuthAuthentication(AuthProvider.GOOGLE,data.oAuthId),
                firstName : data.firstName,
                avatar : null,
                country : null,
                lastName : null,
                role : data.role
            })

            await this._userRepository.create(user);

            const payload : ITokenPayLoadDTO = {
                userId : user.userId,
                email : user.email,
                role : user.role,
                tokenId : randomUUID()
            }


            const accessToken = this._tokenProvider.generateAccessToken(payload);
            const refreshToken = this._tokenProvider.generateRefreshToken(payload);

            return { 
                data : { 
                    accessToken,
                    refreshToken,
                    message : UserSuccessType.SignupSuccess,
                    userInfo : {
                    userId : user.userId,
                    email : user.email,
                    role : user.role
                }
                },    
                success : true
            }

        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }

    }

}

