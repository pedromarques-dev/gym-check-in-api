import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { FetchUsersCheckInsHistoryUseCase } from './fetch-users-check-ins-history';

let checkInRepository: InMemoryCheckInRepository;
let sut: FetchUsersCheckInsHistoryUseCase;

describe('Fetch users check-ins history Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInRepository();
        sut = new FetchUsersCheckInsHistoryUseCase(checkInRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should be able to fetch check-ins by user id', async () => {
        await checkInRepository.create({
            user_id: 'user-1',
            gym_id: 'gym-1',
        });

        await checkInRepository.create({
            user_id: 'user-1',
            gym_id: 'gym-2',
        });

        const { checkIns } = await sut.execute({
            userId: 'user-1',
            page: 1,
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-1' }),
            expect.objectContaining({ gym_id: 'gym-2' }),
        ]);
    });

    it('Should be able to fetch paginated check-ins by user id', async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInRepository.create({
                user_id: 'user-1',
                gym_id: `gym-${i}`,
            });
        }

        const { checkIns } = await sut.execute({
            userId: 'user-1',
            page: 2,
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
        ]);
    });
});
