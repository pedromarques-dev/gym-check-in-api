import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should be able to create a gym', async () => {
        const { gym } = await sut.execute({
            name: 'NodeJS Gym',
            description: 'The awesome javascript gym for backend developers',
            phone: null,
            latitude: -12.9606042,
            longitude: -38.4744777,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});
