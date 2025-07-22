/**
 * Data Transfer Object (DTO) representing the logged-in user's own profile details.
 *
 * @interface
 */
export interface SelfUserDTO {
  username: string
  email: string
  isVerified: boolean
  avatar?: string
  firstName: string
  lastName?: string
  country: string
  preferredLanguage?: string
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSubmission: number
  streak: number
}
