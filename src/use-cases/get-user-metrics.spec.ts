import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInRepository();
        sut = new GetUserMetricsUseCase(checkInsRepository);
    });

    it('Should be able to get check-ins count from metrics', async () => {
        await checkInsRepository.create({
            user_id: 'user-1',
            gym_id: 'gym-1',
        });

        await checkInsRepository.create({
            user_id: 'user-1',
            gym_id: 'gym-2',
        });

        const { checkInsCount } = await sut.execute({
            userId: 'user-1',
        });

        expect(checkInsCount).toEqual(2);
    });
});
