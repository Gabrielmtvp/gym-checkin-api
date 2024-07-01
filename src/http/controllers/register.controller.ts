import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserEmailAlreadyExistsError } from "@/services/errors/user-email-already-exists-error";
import { makeRegisterService } from "@/services/factories/make-register-service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerService = makeRegisterService();

    await registerService.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserEmailAlreadyExistsError) {
      reply.status(409).send({ message: error.message });
    }

    reply.status(500).send({ error });
  }

  return reply.status(201).send();
}
