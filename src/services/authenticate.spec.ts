import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "./authenticate.service";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(inMemoryUsersRepository);
  });

  it("should be able to authenticate", async () => {
    await inMemoryUsersRepository.create({
      name: "Gabriel",
      email: "gabrielmtvp@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "gabrielmtvp@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(inMemoryUsersRepository);

    await expect(() =>
      sut.execute({
        email: "gabrielmtvp1@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(inMemoryUsersRepository);

    await expect(() =>
      sut.execute({
        email: "gabrielmtvp@gmail.com",
        password: "12345",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
