/**
 * Data Transfer Object (DTO) representing user data for public-facing views like leaderboard.
 *
 * @interface
 */
export interface PublicUserDTO {
  username: string;
  avatar?: string;
  country: string;
  preferredLanguage?: string;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmission: number;
  streak: number;
}
