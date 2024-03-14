import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Validate Check in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to validate a check In', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                name: 'JS gym',
                description: 'Some js description',
                phone: null,
                latitude: -12.4030232,
                longitude: -15.2323233,
            },
        });

        let checkIn = await prisma.checkIn.create({
            data: {
                user_id: user.id,
                gym_id: gym.id,
            },
        });

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(204);

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id,
            },
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
    });
});
