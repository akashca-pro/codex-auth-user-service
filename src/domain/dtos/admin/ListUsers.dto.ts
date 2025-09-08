
/**
 * Data Transfer Object (DTO) representing the request to list users.
 *
 * @interface
 */
export interface IListUsersDTO {
    page : number;
    limit : number;
    search? : string;
    sort? : string;
    authProvider? : string;
    isVerified? : boolean;
    isArchived? : boolean;
}