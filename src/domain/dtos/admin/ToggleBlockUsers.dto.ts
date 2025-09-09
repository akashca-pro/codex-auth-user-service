
/**
 * Data Transfer Object (DTO) representing the request to 
 * toggle block or unblock users.
 *
 * @interface
 */
export interface ToggleBlockUserDTO {
  userId: string;         
  block: boolean;         // true = block, false = unblock
}