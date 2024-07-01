import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymService } from "./create-gym";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(inMemoryGymsRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "gym-01",
      description: null,
      phone: null,
      latitude: "35.9189226",
      longitude: "14.4848342",
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
