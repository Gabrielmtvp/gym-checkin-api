import { expect, test, it, describe, beforeEach } from "vitest";
import { RegisterService } from "./register.service";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";
import { compare } from "bcryptjs";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe("Register Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterService(inMemoryUsersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Gabriel",
      email: "gabrielmtvp@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash the user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Gabriel",
      email: "gabrielmtvp@gmail.com",
      password: "123456",
    });

    const isSameHashPassword = await compare("123456", user.password_hash);

    expect(isSameHashPassword).toBe(true);
  });

  it("should not be able to register users with the same email", async () => {
    const email = "gabriel@gmail.com";

    await sut.execute({
      name: "Gabriel",
      email: email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Gabriel",
        email: email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);
  });
});
