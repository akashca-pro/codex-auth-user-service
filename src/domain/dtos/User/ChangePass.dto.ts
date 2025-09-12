
/**
 * Data Transfer Object (DTO) representing the request for change pass use case.
 */
export interface IChangePassRequestDTO{ 
    currPass : string;
    newPass : string;
}