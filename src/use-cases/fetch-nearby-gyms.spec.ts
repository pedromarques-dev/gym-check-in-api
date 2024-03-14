import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Ftech Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            name: 'Near Gym',
            latitude: -12.4030232,
            longitude: -15.2323233,
        });

        await gymsRepository.create({
            name: 'Far Gym',
            latitude: -29.8014144,
            longitude: -38.2323233,
        });

        const { gyms } = await sut.execute({
            userLatitude: -12.4030232,
            userLongitude: -15.2323233,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ name: 'Near Gym' })]);
    });
});
