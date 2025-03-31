// Importamos las dependencias principales.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../../test-utils';

// Definimos la app, el servidor HTTP y el token.
let app: INestApplication;
let httpServer: any;
let token: string;

// Inicializamos el test del endpoint de actualización de usuario.
describe('PUT /api/users (e2e)', () => {
    // Creamos la app, registramos usuario y obtenemos token.
    beforeAll(async () => {
        const testApp = await createTestApp();
        app = testApp.app;
        httpServer = testApp.httpServer;

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

    // Test: actualizar solo el nombre de usuario.
    it('debería actualizar el nombre de usuario', async () => {
        const response = await request(httpServer)
            .put('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'josinho_updated' });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            message: 'Usuario actualizado',
            data: expect.objectContaining({
                username: 'josinho_updated',
            }),
        });
    });

    // Test: actualizar la contraseña correctamente.
    it('debería actualizar la contraseña', async () => {
        const response = await request(httpServer)
            .put('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: 'NuevaPassword123!',
                repeatedPass: 'NuevaPassword123!',
            });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            message: 'Usuario actualizado',
        });
    });

    // Test: error si las contraseñas no coinciden.
    it('debería lanzar error si las contraseñas no coinciden', async () => {
        const response = await request(httpServer)
            .put('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: 'NuevaPassword123!',
                repeatedPass: 'OtraPassword123!',
            });

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            message: 'Las contraseñas no coinciden',
        });
    });
});
