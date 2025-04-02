// Importamos las dependencias principales.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

// Importamos herramientas auxiliares.
import { createTestApp } from '../../../test-utils';

// Definimos la app, el servidor HTTP y el token.
let app: INestApplication;
let httpServer: any;
let token: string;

// Inicializamos el test del endpoint de subida de avatar.
describe('PUT /api/users/avatar (e2e)', () => {
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

    // Cerramos la app y eliminamos uploads-test al terminar los tests.
    afterAll(async () => {
        await app.close();

        const uploadsTestPath = path.resolve(process.cwd(), 'uploads-test');

        try {
            await fs.rm(uploadsTestPath, { recursive: true, force: true });
        } catch (error) {
            console.error('Error al eliminar uploads-test:', error);
        }
    });

    // Test: subir un avatar como usuario autenticado.
    it('debería subir un avatar y devolver su nombre de archivo', async () => {
        const imagePath = path.join(
            __dirname,
            '../../../assets/avatar-test.png',
        );

        const response = await request(httpServer)
            .put('/api/users/avatar')
            .set('Authorization', `Bearer ${token}`)
            .attach('avatar', imagePath);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            message: 'Avatar actualizado',
            data: {
                filename: expect.any(String),
            },
        });
    });
});
