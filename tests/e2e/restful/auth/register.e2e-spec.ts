// Importamos las dependencias necesarias.
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../../../test-utils';

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

    // Caso positivo: registrar un nuevo usuario correctamente.
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

    // Caso negativo: email ya registrado.
    it('debería fallar si el email ya está registrado', async () => {
        const payload = {
            username: 'usuario1',
            firstName: 'Nombre',
            lastName: 'Apellido',
            birthDate: '2000-01-01',
            email: 'duplicado@email.com',
            password: 'Hackaboss17!',
            repeatedPass: 'Hackaboss17!',
            role: 'family',
        };

        await request(httpServer).post('/api/users/register').send(payload);

        const response = await request(httpServer)
            .post('/api/users/register')
            .send({ ...payload, username: 'otroUsername' });

        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Ya existe una cuenta con este email',
        });
    });

    // Caso negativo: username ya registrado.
    it('debería fallar si el nombre de usuario ya está en uso', async () => {
        const payload = {
            username: 'usuarioDuplicado',
            firstName: 'Nombre',
            lastName: 'Apellido',
            birthDate: '2000-01-01',
            email: 'otro@email.com',
            password: 'Hackaboss17!',
            repeatedPass: 'Hackaboss17!',
            role: 'family',
        };

        await request(httpServer).post('/api/users/register').send(payload);

        const response = await request(httpServer)
            .post('/api/users/register')
            .send({ ...payload, email: 'nuevo@email.com' });

        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'El nombre de usuario ya está en uso',
        });
    });

    // Caso negativo: contraseñas distintas.
    it('debería fallar si las contraseñas no coinciden', async () => {
        const response = await request(httpServer)
            .post('/api/users/register')
            .send({
                username: 'nuevo',
                firstName: 'Ana',
                lastName: 'Martínez',
                birthDate: '1990-10-10',
                email: 'ana@email.com',
                password: '12345678',
                repeatedPass: '87654321',
                role: 'family',
            });

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Las contraseñas no coinciden',
        });
    });
});
