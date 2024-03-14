import { MaxDistanceError } from '@/use-cases/errors/max-distance-error';
import { MaxNumberCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInBodySchema = z.object({
        userLatitude: z.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        userLongitude: z.number().refine((value) => {
            return Math.abs(value) <= 100;
        }),
    });

    const createCheckInsParamsSchema = z.object({
        gymId: z.string().uuid(),
    });

    const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
        request.body,
    );

    const { gymId } = createCheckInsParamsSchema.parse(request.params);

    try {
        const checkInUseCase = makeCheckInUseCase();

        await checkInUseCase.execute({
            gymId,
            userId: request.user.sub,
            userLatitude,
            userLongitude,
        });
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }

        if (
            error instanceof MaxDistanceError ||
            error instanceof MaxNumberCheckInsError
        ) {
            return reply.status(400).send({ message: error.message });
        }

        throw error;
    }

    return reply.status(201).send();
}
