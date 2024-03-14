import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-1',
            name: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -12.9606042,
            longitude: -38.4744777,
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: -12.9606042,
            userLongitude: -38.4744777,
        });

        expect(checkIn.gym_id).toEqual('gym-1');
    });

    it('Should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: -12.9606042,
            userLongitude: -38.4744777,
        });

        await expect(() =>
            sut.execute({
                userId: 'user-1',
                gymId: 'gym-1',
                userLatitude: -12.9606042,
                userLongitude: -38.4744777,
            }),
        ).rejects.toBeInstanceOf(MaxNumberCheckInsError);
    });

    it('Should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: -12.9606042,
            userLongitude: -38.4744777,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: -12.9606042,
            userLongitude: -38.4744777,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('Should not be able to check in on distant gym', async () => {
        await gymsRepository.create({
            id: 'gym-2',
            name: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -12.9606042,
            longitude: -38.4744777,
        });

        await expect(() =>
            sut.execute({
                userId: 'user-1',
                gymId: 'gym-2',
                userLatitude: -10.2206042,
                userLongitude: -12.2312221,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError);
    });
});
