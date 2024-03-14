import { beforeEach, describe, expect, it, afterEach, vi } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidateError } from './errors/late-check-in-validate-error';

let checkInRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInRepository();
        sut = new ValidateCheckInUseCase(checkInRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should be able to validate the check in', async () => {
        const newCheckIn = await checkInRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1',
        });

        const { checkIn } = await sut.execute({
            checkInId: newCheckIn.id,
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInRepository.items[0].validated_at).toEqual(
            expect.any(Date),
        );
    });

    it('Should not be able to validate an inexistent check in', async () => {
        await expect(() =>
            sut.execute({
                checkInId: 'inexistent-check-in',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it('Should not be able to validate the check in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

        const newCheckIn = await checkInRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1',
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21;

        vi.advanceTimersByTime(twentyOneMinutesInMs);

        await expect(() =>
            sut.execute({
                checkInId: newCheckIn.id,
            }),
        ).rejects.toBeInstanceOf(LateCheckInValidateError);
    });
});
