
/**
 * The Data Transfer Object (DTO) representing the output user data
 * 
 * @interface
 */
export interface IUserOutRequestDTO {
    userId : string;
    username : string;
    email : string;
    firstName : string;
    lastName : string | null;
    avatar : string | null;
    country : string | null;
    preferredLanguage : string | null;
    easySolved: number | null;
    mediumSolved: number | null;
    hardSolved: number | null;
    totalSubmission: number | null;
    streak: number | null;
    createdAt : Date;
    updatedAt : Date;
}