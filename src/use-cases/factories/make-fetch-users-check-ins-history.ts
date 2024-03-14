import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { FetchUsersCheckInsHistoryUseCase } from '../fetch-users-check-ins-history';

export function makeFetchUsersCheckInsHistoryUseCase() {
    const checkInRepository = new PrismaCheckInRepository();
    const fetchUsersCheckInsHistoryUseCase =
        new FetchUsersCheckInsHistoryUseCase(checkInRepository);

    return fetchUsersCheckInsHistoryUseCase;
}
