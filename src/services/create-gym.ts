import { hash } from "bcryptjs";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";
import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface CreateGymServiceRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: string;
  longitude: string;
}

interface CreateGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const gym = await this.gymRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
