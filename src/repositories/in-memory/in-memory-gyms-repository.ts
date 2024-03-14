import { randomUUID } from 'node:crypto';
import {
    FindManyNearbyParams,
    GymsRepository,
} from '@/interfaces/gyms-repository';
import { Gym, Prisma } from '@prisma/client';
import { getDistanceBetweenCoordinate } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = [];

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: data.id ?? randomUUID(),
            name: data.name,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date(),
        };

        this.items.push(gym);

        return gym;
    }

    async findById(id: string) {
        const gym = this.items.find((item) => item.id === id);

        if (!gym) {
            return null;
        }

        return gym;
    }

    async findMany(query: string, page: number): Promise<Gym[]> {
        return this.items
            .filter((item) => item.name.includes(query))
            .slice((page - 1) * 20, page * 20);
    }

    async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
        return this.items.filter((item) => {
            const distance = getDistanceBetweenCoordinate(
                {
                    latitude,
                    longitude,
                },
                {
                    latitude: item.latitude.toNumber(),
                    longitude: item.longitude.toNumber(),
                },
            );

            return distance < 10;
        });
    }
}
