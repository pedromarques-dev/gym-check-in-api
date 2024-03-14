import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { ValidateCheckInUseCase } from '../validate-check-in';

export function makeValidateCheckInUseCase() {
    const checkInRepository = new PrismaCheckInRepository();
    const validateCheckInUseCase = new ValidateCheckInUseCase(
        checkInRepository,
    );

    return validateCheckInUseCase;
}
