import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('Should be able to get the user profile', async () => {
        const newUser = await usersRepository.create({
            name: 'teste',
            email: 'teste@teste.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            userId: newUser.id,
        });

        expect(user.id).toEqual(newUser.id);
    });

    it('Should not be able to get the user profile with wrong id', async () => {
        await expect(() =>
            sut.execute({
                userId: 'non-existing-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
