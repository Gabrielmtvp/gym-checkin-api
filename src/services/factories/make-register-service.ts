import { PrismaUsersRepository } from "@/repositories/prisma/prisma-user-repository";
import { RegisterService } from "../register.service";

export function makeRegisterService() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerService = new RegisterService(prismaUsersRepository);

  return registerService;
}
