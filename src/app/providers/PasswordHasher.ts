/**
 * Interface for the provider responsible for
 * hashing and comparing hashed passwords. 
 *
 * @interface
 */
export interface IPasswordHasher {

    /**
     * Hashes the provided password
     * 
     * @param {string} password 
     * @returns {Promise<string>}
     */
    hashPassword(password : string) : Promise<string>;

    /**
     * Compares provided password with hashed password
     * 
     * @param {string} password 
     * @param {string} hashedPassword 
     * @return {Promise<boolean>}
     */
    comparePasswords(password : string, hashedPassword : string) : Promise<boolean>;
}