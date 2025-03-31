// Importamos las dependencias principales.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../../test-utils';

// Definimos la app, el servidor HTTP y el token.
let app: INestApplication;
let httpServer: any;
let token: string;

// Inicializamos el test del endpoint de perfil privado.
describe('GET /api/users/private (e2e)', () => {
    // Creamos la app, registramos usuario y obtenemos token.
    beforeAll(async () => {
        const testApp = await createTestApp();
        app = testApp.app;
        httpServer = testApp.httpServer;

        // Registramos al usuario con el que haremos login.
        await request(httpServer).post('/api/users/register').send({
            username: 'josinho',
            firstName: 'Jose',
            lastName: 'Ramón Gayoso',
            birthDate: '2004-04-04',
            email: 'jose.ramon@gmail.com',
            password: 'Hackaboss17!',
            repeatedPass: 'Hackaboss17!',
            role: 'family',
        });

        // Obtenemos el token de autenticación.
        const res = await request(httpServer).post('/api/users/login').send({
            email: 'jose.ramon@gmail.com',
            password: 'Hackaboss17!',
        });

        token = res.body.data.token;
    });

    // Cerramos la app al terminar los tests.
    afterAll(async () => {
        await app.close();
    });

    // Test principal: obtener el perfil privado con JWT válido.
    it('debería devolver el perfil privado del usuario autenticado', async () => {
        const response = await request(httpServer)
            .get('/api/users/private')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            data: {
                id: expect.any(Number),
                username: 'josinho',
                firstName: 'Jose',
                lastName: 'Ramón Gayoso',
                email: 'jose.ramon@gmail.com',
                avatar: null,
                role: 'family',
                createdAt: expect.any(String),
                modifiedAt: expect.any(String),
            },
        });
    });
});
