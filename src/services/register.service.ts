import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";
import { User } from "@prisma/client";

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterServiceResponse {
  user: User;
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userWithTheSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithTheSameEmail) {
      throw new UserEmailAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
