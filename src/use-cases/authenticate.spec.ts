import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('Should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'teste',
            email: 'teste@teste.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            email: 'teste@teste.com',
            password: '123456',
        });

        expect(user.email).toEqual(expect.any(String));
    });

    it('Should not be able to authenticate with wrong email', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await expect(() =>
            sut.execute({
                email: 'teste@teste.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('Should not be able to authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository();
        const sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name: 'teste',
            email: 'teste@teste.com',
            password_hash: await hash('123456', 6),
        });

        await expect(() =>
            sut.execute({
                email: 'teste@teste.com',
                password: '1234567',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
