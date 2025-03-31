// Importamos las dependencias necesarias.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../../test-utils';

// Definimos la app y el servidor HTTP.
let app: INestApplication;
let httpServer: any;

describe('POST /api/users/register (e2e)', () => {
    beforeAll(async () => {
        // Creamos la app de test con sincronización de la base de datos.
        const testApp = await createTestApp();
        app = testApp.app;
        httpServer = testApp.httpServer;
    });

    afterAll(async () => {
        await app.close();
    });

    it('debería registrar un usuario nuevo', async () => {
        const response = await request(httpServer)
            .post('/api/users/register')
            .send({
                username: 'josinho',
                firstName: 'Jose',
                lastName: 'Ramón Gayoso',
                birthDate: '2004-04-04',
                email: 'jose.ramon@gmail.com',
                password: 'Hackaboss17!',
                repeatedPass: 'Hackaboss17!',
                role: 'family',
            });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            status: 'ok',
            message: 'Usuario registrado',
            data: {
                id: expect.any(Number),
                email: 'jose.ramon@gmail.com',
                role: 'family',
            },
        });
    });
});
