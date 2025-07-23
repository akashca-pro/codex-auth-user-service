import { EmailErrorType } from "@/domain/enums/email/ErrorType";
import { Email } from "@/domain/valueObjects/Email"


describe("Email value object", () => {
    it("Should create a valid email",()=>{
        const email = new Email({address : 'user@example.com'});
        expect(email.address).toBe('user@example.com');
    })

    it("should throw error for invalid email",()=>{
        expect(()=>{
            new Email({address : 'invalid-email'})
        }).toThrow(EmailErrorType.InvalidEmail);
    });

    it("should throw error for empty email", () => {
        expect(() => {
        new Email({ address: "" });
        }).toThrow(EmailErrorType.InvalidEmail);
    });
})

