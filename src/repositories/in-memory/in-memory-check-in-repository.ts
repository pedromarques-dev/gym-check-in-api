import { CheckInsRepository } from '@/interfaces/check-ins-repository';
import { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');

        const checkInOnSameDate = this.items.find((checkin) => {
            const checkInDate = dayjs(checkin.created_at);
            const isOnSameDate =
                checkInDate.isAfter(startOfTheDay) &&
                checkInDate.isBefore(endOfTheDay);

            return checkin.user_id === userId && isOnSameDate;
        });

        if (!checkInOnSameDate) {
            return null;
        }

        return checkInOnSameDate;
    }

    async findManyByUserId(userId: string, page: number) {
        const checkInsByUserId = this.items
            .filter((checkIn) => checkIn.user_id === userId)
            .slice((page - 1) * 20, page * 20);

        return checkInsByUserId;
    }

    async findById(id: string) {
        const checkIn = this.items.find((item) => item.id === id);

        if (!checkIn) {
            return null;
        }

        return checkIn;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            created_at: new Date(),
            validated_at: data.validated_at
                ? new Date(data.validated_at)
                : null,
            gym_id: data.gym_id,
            user_id: data.user_id,
        };

        this.items.push(checkIn);

        return checkIn;
    }

    async countByUserId(userId: string) {
        const checkInsByUserId = this.items.filter(
            (checkIn) => checkIn.user_id === userId,
        );

        return checkInsByUserId.length;
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.items.findIndex(
            (item) => item.id === checkIn.id,
        );

        if (checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn;
        }

        return checkIn;
    }
}
