import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { GetUserProfileService } from "./get-user-profile.service";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(inMemoryUsersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: "Gabriel",
      email: "gabrielmtvp@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("Gabriel");
  });

  it("should not be able to get user profile with wrong user id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
