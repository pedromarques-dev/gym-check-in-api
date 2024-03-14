import { GymsRepository } from '@/interfaces/gyms-repository';
import { Gym } from '@prisma/client';

interface CreateGymUseCaseRequest {
    name: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

interface CreateGymUseCaseResponse {
    gym: Gym;
}

export class CreateGymUseCase {
    constructor(private gymsRepository: GymsRepository) {}

    async execute(
        props: CreateGymUseCaseRequest,
    ): Promise<CreateGymUseCaseResponse> {
        const { name, description, phone, latitude, longitude } = props;

        const gym = await this.gymsRepository.create({
            name,
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
