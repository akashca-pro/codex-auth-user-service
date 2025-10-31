/**
 * Data Transfer Object (DTO) representing Token payload.
 *
 * @interface
 */
export interface ITokenPayLoadDTO {
    /**
     * The id of the user.
     */
    userId : string;

    /**
     * The email address of the user for authentication.
     */
    email : string;

    /**
     * The username of the user
     */
    username? : string;

    /**
     * The role of the user.
     */
    role : string;

    /**
     * Unique id for token.
     */
    tokenId : string;
}
