import { User } from "@/domain/entities/User"; // adjust import path if needed
import { UserRole } from "@/domain/enums/UserRole";
import { IUpdateUserRequestDTO } from "@/domain/dtos/User/UpdateUser";

// Mock Email class behavior if needed
jest.mock("@/domain/valueObjects/Email", () => {
  return {
    Email: jest.fn().mockImplementation(({ address }) => ({
      address: address.trim().toLowerCase(), // mimic normalization
    })),
  };
});

describe("User.update", () => {

// When the role is USER, fields should remain as provided.

  it("should retain user fields for USER role", () => {
    const input: IUpdateUserRequestDTO = {
      username: "john",
      email: "JOHN@EMAIL.COM",
      firstName: "John",
      lastName: "Doe",
      avatar: "pic",
      country: "India",
      role: UserRole.USER,
      preferredLanguage: "typescript",
      easySolved: 10,
      mediumSolved: 5,
      hardSolved: 2,
      totalSubmission: 50,
      streak: 7,
      updatedAt: new Date(),
    };

    const updated = User.update(input);

    expect(updated.email).toBe("john@email.com"); // normalized
    expect(updated.easySolved).toBe(10);
    expect(updated.streak).toBe(7);
    expect(updated.preferredLanguage).toBe("typescript");
  });

  // When the role is ADMIN, some fields should be set to null.
  
  it("should nullify specific fields for ADMIN role", () => {
    const input: IUpdateUserRequestDTO = {
      username: "admin",
      email: "ADMIN@EMAIL.COM",
      firstName: "Admin",
      lastName: null,
      avatar: null,
      country: "India",
      role: UserRole.ADMIN,
      preferredLanguage: "typescript",
      easySolved: 10,
      mediumSolved: 5,
      hardSolved: 2,
      totalSubmission: 50,
      streak: 7,
      updatedAt: new Date(),
    };

    const updated = User.update(input);

    expect(updated.email).toBe("admin@email.com"); // normalized
    expect(updated.easySolved).toBeNull();
    expect(updated.streak).toBeNull();
    expect(updated.preferredLanguage).toBeNull();
  });
});
