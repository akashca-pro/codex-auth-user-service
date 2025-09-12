/**
 * Interface for the provider responsible for
 * hashing and comparing hashed passwords. 
 *
 * @interface
 */
export interface IPasswordHasher {

    /**
     * Hashes the provided password.
     * 
     * @async
     * @param {string} password - The password to be hashed.
     * @returns {Promise<string>} - The hashed password.
     */
    hashPassword(password : string) : Promise<string>;

    /**
     * Compares provided password with hashed password.
     * 
     * @async
     * @param {string} password - The password to be compared.
     * @param {string} hashedPassword - The hashed password.
     * @return {Promise<boolean>} - A boolean indicating whether the password matches.
     */
    comparePasswords(password : string, hashedPassword : string) : Promise<boolean>;
}