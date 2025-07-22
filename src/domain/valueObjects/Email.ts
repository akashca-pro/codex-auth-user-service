import { EmailErrorType } from "../enums/email/ErrorType";

/**
 * Type representing the properties needed to create an Email instance
 * 
 * @interface
 */
type EmailProps = {
    address : string;
}

/**
 * Class representing an email address
 * 
 * @class
 */
export class Email {
    private _address : string;

    /**
     * Getter for the email address
     * 
     * @readonly
     * @returns {string}
     */
    get address() : string {
        return this._address;
    }

    /**
     * Creates an instance of the Email address
     * 
     * @constructor
     * @param {EmailProps} props - The property to create an email instance
     * @throws {Error} Throws an error if the email address is invalid.
     */
    constructor(props : EmailProps){
        if(
            props.address === null ||
            !props.address.match(
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            )
        ) {
            throw new Error(EmailErrorType.InvalidEmail);
        }
        this._address = props.address;
    }
}