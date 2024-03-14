import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to authenticate', async () => {
        await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'teste@example.com',
            password: '123456',
        });

        const auth = await request(app.server).post('/auth').send({
            email: 'teste@example.com',
            password: '123456',
        });

        expect(auth.statusCode).toEqual(200);
        expect(auth.body.token).toEqual(expect.any(String));
    });
});
