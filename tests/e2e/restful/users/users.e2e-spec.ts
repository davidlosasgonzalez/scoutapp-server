// Importamos las dependencias principales.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createTestApp } from '../../../test-utils';

// Definimos la app, el servidor HTTP y el token.
let app: INestApplication;
let httpServer: any;
let token: string;

// Inicializamos el test del endpoint de perfil privado.
describe('GET /api/users/private (e2e)', () => {
    // Creamos la app, registramos usuario y obtenemos token antes de los tests.
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

        // Obtenemos el token de autenticación para las peticiones autenticadas.
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

    // Test negativo: token inválido.
    it('debería fallar si el token es inválido', async () => {
        const response = await request(httpServer)
            .get('/api/users/private')
            .set('Authorization', `Bearer token-falso`);

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Unauthorized',
        });
    });

    // Test negativo: sin token.
    it('debería fallar si no se proporciona un token', async () => {
        const response = await request(httpServer).get('/api/users/private');

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Unauthorized',
        });
    });

    // Test negativo: usuario no existe.
    it('debería lanzar error si el usuario no existe', async () => {
        // Obtenemos JwtService desde la app para firmar un token válido.
        const jwtService = app.get(JwtService);

        // Generamos un token real con un userId inexistente (por ejemplo 9999).
        const fakeToken = jwtService.sign({ sub: 9999 });

        // Hacemos la petición autenticada con el token generado.
        const response = await request(httpServer)
            .get('/api/users/private')
            .set('Authorization', `Bearer ${fakeToken}`);

        // Verificamos que el servicio lanza correctamente un error 404.
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Usuario no encontrado',
        });
    });
});
