import { AuthProvider } from '../../enums/AuthProvider'
import { UserRole } from '../../enums/UserRole'

/**
 * Data Transfer Object (DTO) representing user data for admin panel usage.
 *
 * @interface
 */
export interface AdminUserDTO {
  userId: string
  username: string
  email: string
  isVerified: boolean
  provider: AuthProvider
  googleId?: string
  isArchived: boolean
  role: UserRole
  country: string
  preferredLanguage?: string
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSubmission: number
  streak: number
  createdAt: Date
  updatedAt: Date
}
