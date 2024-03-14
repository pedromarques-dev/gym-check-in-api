import { CheckInsRepository } from '@/interfaces/check-ins-repository';
import { prisma } from '@/lib/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';

export class PrismaCheckInRepository implements CheckInsRepository {
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate(),
                },
            },
        });

        return checkIn;
    }

    async findManyByUserId(userId: string, page: number) {
        const checkInsByUserId = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return checkInsByUserId;
    }

    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id,
            },
        });

        return checkIn;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        });

        return checkIn;
    }

    async countByUserId(userId: string) {
        const checkInsByUserId = await prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        });

        return checkInsByUserId;
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            data,
            where: {
                id: data.id,
            },
        });

        return checkIn;
    }
}
