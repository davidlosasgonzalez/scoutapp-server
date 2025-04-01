// Importamos las dependencias principales.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../../../test-utils';

// Definimos la app y el servidor HTTP.
let app: INestApplication;
let httpServer: any;

// Inicializamos el test del endpoint de login.
describe('POST /api/users/login (e2e)', () => {
    // Creamos la app y registramos un usuario antes del test.
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
    });

    // Cerramos la app al finalizar los tests.
    afterAll(async () => {
        await app.close();
    });

    // Caso positivo: login con credenciales correctas.
    it('debería iniciar sesión correctamente', async () => {
        const response = await request(httpServer)
            .post('/api/users/login')
            .send({
                email: 'jose.ramon@gmail.com',
                password: 'Hackaboss17!',
            });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            message: 'Login correcto',
            data: {
                token: expect.any(String),
            },
        });
    });

    // Caso negativo: email no registrado.
    it('debería fallar si el email no está registrado', async () => {
        const response = await request(httpServer)
            .post('/api/users/login')
            .send({
                email: 'inexistente@email.com',
                password: 'Hackaboss17!',
            });

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Credenciales inválidas',
        });
    });

    // Caso negativo: contraseña incorrecta.
    it('debería fallar si la contraseña es incorrecta', async () => {
        const response = await request(httpServer)
            .post('/api/users/login')
            .send({
                email: 'jose.ramon@gmail.com',
                password: 'ContraseñaIncorrecta123',
            });

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Credenciales inválidas',
        });
    });
});
