import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';
import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const fetchNearbyGymsQuerySchema = z.object({
        latitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 100;
        }),
    });

    const { latitude, longitude } = fetchNearbyGymsQuerySchema.parse(
        request.query,
    );

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

    const { gyms } = await fetchNearbyGymsUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    });

    return reply.status(200).send({
        gyms,
    });
}
