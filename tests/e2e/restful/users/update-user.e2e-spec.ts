// Importamos las dependencias principales.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Importamos herramientas auxiliares.
import { createTestApp } from '../../../test-utils';

// Definimos la app, el servidor HTTP y el token.
let app: INestApplication;
let httpServer: any;
let token: string;

// Inicializamos el test del endpoint de actualización de usuario.
describe('PUT /api/users (e2e)', () => {
    // Creamos la app, registramos usuario y obtenemos token antes de los tests.
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

    // Test positivo: actualizar el nombre de usuario.
    it('debería actualizar el nombre de usuario', async () => {
        const response = await request(httpServer)
            .put('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'josinho_updated' });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            status: 'ok',
            message: 'Usuario actualizado',
            data: expect.objectContaining({ username: 'josinho_updated' }),
        });
    });

    // Test positivo: actualizar la contraseña correctamente.
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

    // Test negativo: contraseñas no coinciden.
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
            status: 'error',
            message: 'Las contraseñas no coinciden',
        });
    });

    // Test negativo: falta una contraseña válida (ambas deben ser válidas).
    it('debería lanzar error si falta una de las contraseñas', async () => {
        const response = await request(httpServer)
            .put('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'SoloUnaPass123!' });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('repeatedPass');
    });

    // Test negativo: token inválido.
    it('debería lanzar error si el token es inválido', async () => {
        const response = await request(httpServer)
            .put('/api/users')
            .set('Authorization', 'Bearer token-falso')
            .send({ username: 'cualquiera' });

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Unauthorized',
        });
    });

    // Test negativo: usuario no encontrado (token válido pero userId inexistente).
    it('debería lanzar error si el usuario no existe', async () => {
        const jwtService = app.get(JwtService);
        const fakeToken = jwtService.sign({ sub: 9999 });

        const response = await request(httpServer)
            .put('/api/users')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ username: 'nombre' });

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Usuario no encontrado',
        });
    });
});
