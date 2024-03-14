import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should be able to search for gyms', async () => {
        await gymsRepository.create({
            name: 'Gym-JS',
            latitude: -12.4030232,
            longitude: -15.2323233,
        });

        await gymsRepository.create({
            name: 'Gym-TS',
            latitude: -12.4030232,
            longitude: -15.2323233,
        });

        const { gyms } = await sut.execute({
            query: 'JS',
            page: 1,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ name: 'Gym-JS' })]);
    });

    it('Should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                name: `Gym-JS ${i}`,
                latitude: -12.4030232,
                longitude: -15.2323233,
            });
        }
        const { gyms } = await sut.execute({
            query: 'JS',
            page: 2,
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ name: 'Gym-JS 21' }),
            expect.objectContaining({ name: 'Gym-JS 22' }),
        ]);
    });
});
