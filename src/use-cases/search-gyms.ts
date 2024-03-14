import { GymsRepository } from '@/interfaces/gyms-repository';
import { Gym } from '@prisma/client';

interface SearchGymsUseCaseRequest {
    query: string;
    page: number;
}

interface SearchGymsUseCaseResponse {
    gyms: Gym[];
}

export class SearchGymsUseCase {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({
        query,
        page,
    }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
        const gyms = await this.gymsRepository.findMany(query, page);

        return {
            gyms,
        };
    }
}
