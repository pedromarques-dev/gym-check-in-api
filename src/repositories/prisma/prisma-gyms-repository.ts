import {
    FindManyNearbyParams,
    GymsRepository,
} from '@/interfaces/gyms-repository';
import { Gym, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class PrismaGymsRepository implements GymsRepository {
    public items: Gym[] = [];

    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data,
        });

        return gym;
    }

    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id,
            },
        });

        return gym;
    }

    async findMany(query: string, page: number): Promise<Gym[]> {
        const gyms = await prisma.gym.findMany({
            where: {
                name: {
                    contains: query,
                },
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return gyms;
    }

    async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE ${latitude} = latitude AND ${longitude} = longitude
            OR ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
       `;

        return gyms;
    }
}
