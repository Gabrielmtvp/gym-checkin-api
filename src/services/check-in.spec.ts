import { expect, it, describe, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInService } from "./check-in.service";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check In Use Case", () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(
      inMemoryCheckInsRepository,
      inMemoryGymsRepository
    );

    await inMemoryGymsRepository.create({
      id: "gym-01",
      title: "js",
      description: "",
      phone: "",
      latitude: 35.9189226,
      longitude: 14.4848342,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create a check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitute: 35.9189226,
      userLongitude: 14.4848342,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same date", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitute: 35.9189226,
      userLongitude: 14.4848342,
    });

    expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitute: 35.9189226,
        userLongitude: 14.4848342,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should not be able to check in twice but different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitute: 35.9189226,
      userLongitude: 14.4848342,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitute: 35.9189226,
      userLongitude: 14.4848342,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    inMemoryGymsRepository.gyms.push({
      id: "gym-02",
      title: "Javascript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(35.9189226),
      longitude: new Decimal(14.4848342),
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitute: 35.90812,
        userLongitude: 14.8103041,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
