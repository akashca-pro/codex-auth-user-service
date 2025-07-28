import TYPES from "@/config/inversify/types";
import { injectable, inject } from "inversify";
import { IAuthenticateOAuthUserDTO } from "@/domain/dtos/Authenticate/AuthenticateUser";
import { ResponseDTO } from "@/domain/dtos/Response";
import { IAuthenticateOAuthUserUseCase } from "../AuthenticateOAuthUser";
import { IUserRepository } from "@/app/repository/User";
import { ITokenProvider } from "@/app/providers/GenerateTokens";
import { UserErrorType } from "@/domain/enums/user/ErrorType";
import { User } from "@/domain/entities/User";
import { OAuthAuthentication } from "@/domain/valueObjects/UserAuthentication";
import { AuthProvider } from "@/domain/enums/AuthProvider"; 
import { UserRole } from "@/domain/enums/UserRole";
import { UserSuccessType } from "@/domain/enums/user/SuccessType";
import { ITokenPayLoadDTO } from "@/domain/dtos/TokenPayload";

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
     * @param {IUserRepository} userRepository - The repository of the user.
     * @param {ITokenProvider} tokenProvider - Token service provider for generating token.
     * @contructor
     */
     constructor(
        @inject(TYPES.IUserRepository)
        private userRepository : IUserRepository,

        @inject(TYPES.ITokenProvider)
        private tokenProvider : ITokenProvider
     ){}

    /**
     * Executes the oauth authentication use case.
     * 
     * @param {IAuthenticateOAuthUserDTO} credentials - The user credentials for authentication.
     * @return {Promise<ResponseDTO>} - The response data.
     */ 
    async execute({ email, oAuthId, firstName, username, }: IAuthenticateOAuthUserDTO): Promise<ResponseDTO> {
        
        try {
            const userAlreadyExists = await this.userRepository.findByEmail(email)

            if(userAlreadyExists){
                return {
                    data : { message : UserErrorType.UserAlreadyExists },
                    success : false
                }
            }

            const user = User.create({
                username,
                email,
                authentication : new OAuthAuthentication(AuthProvider.GOOGLE,oAuthId),
                firstName : firstName,
                avatar : null,
                country : null,
                lastName : null,
                role : UserRole.USER
            })

            await this.userRepository.create(user);

            const payload : ITokenPayLoadDTO = {
                userId : user.userId,
                email : user.email,
                role : user.role
            }


            const accessToken = this.tokenProvider.generateAccessToken(payload);
            const refreshToken = this.tokenProvider.generateRefreshToken(payload);

            return { 
                data : { 
                    accessToken,
                    refreshToken,
                    message : UserSuccessType.SignupSuccess,
                    userInfo : payload
                 },    
                success : true
            }

        } catch (error : any) {
            return { data : { message : error.message } , success : false };
        }

    }

}

