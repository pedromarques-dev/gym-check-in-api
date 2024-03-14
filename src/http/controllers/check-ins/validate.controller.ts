import { LateCheckInValidateError } from '@/use-cases/errors/late-check-in-validate-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-ins-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInsParamsSchema = z.object({
        checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInsParamsSchema.parse(request.params);

    try {
        const validateCheckInUseCase = makeValidateCheckInUseCase();

        await validateCheckInUseCase.execute({
            checkInId,
        });
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }

        if (error instanceof LateCheckInValidateError) {
            return reply.status(400).send({ message: error.message });
        }

        throw error;
    }

    return reply.status(204).send();
}
