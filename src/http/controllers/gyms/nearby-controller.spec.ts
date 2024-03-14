import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Nearby JS Gym',
                description: 'Nearby JS Academy for devs',
                phone: null,
                latitude: -12.4030232,
                longitude: -15.2323233,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Far JS Gym',
                description: 'Far JS Academy for devs',
                phone: null,
                latitude: -32.8370232,
                longitude: -40.2323233,
            });

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -12.4030232,
                longitude: -15.2323233,
            })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                name: 'Nearby JS Gym',
            }),
        ]);
    });
});
