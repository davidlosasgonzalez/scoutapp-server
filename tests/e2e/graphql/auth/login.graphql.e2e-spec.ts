// Importamos las dependencias principales.
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';

// Importamos herramientas auxiliares.
import { resetTestDatabase } from '../../utils/reset-db.util';

// Inicializamos el test e2e de la mutación "login" en GraphQL.
describe('GraphQL: MUTATION login (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    // Configuramos la app y limpiamos la base antes de ejecutar los tests.
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule.forRoot('.env.test')],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        dataSource = app.get<DataSource>(DataSource);
        await resetTestDatabase(dataSource);

        // Creamos un usuario de prueba con la mutación "register".
        const registerQuery = `
            mutation {
                register(input: {
                    username: "josinho",
                    firstName: "Jose",
                    lastName: "Ramón Gayoso",
                    birthDate: "2004-04-04",
                    email: "jose.ramon@gmail.com",
                    password: "Hackaboss17!",
                    repeatedPass: "Hackaboss17!",
                    role: "family"
                }) {
                    status
                    message
                    data {
                        id
                    }
                }
            }
        `;

        await request(app.getHttpServer())
            .post('/graphql')
            .send({ query: registerQuery });
    });

    // Cerramos la app tras finalizar los tests.
    afterAll(async () => {
        await app.close();
    });

    // Test principal: iniciar sesión y obtener un token válido.
    it('debería iniciar sesión y devolver un token JWT', async () => {
        const loginQuery = `
            mutation {
                login(input: {
                    email: "jose.ramon@gmail.com",
                    password: "Hackaboss17!"
                }) {
                    status
                    message
                    data {
                        token
                    }
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query: loginQuery });

        if (!response.body.data?.login?.data?.token) {
            console.dir(response.body, { depth: null });
            throw new Error(
                'Login GraphQL falló: no se recibió data.login.data.token',
            );
        }

        // Validamos la respuesta esperada.
        expect(response.status).toBe(200);
        expect(response.body.data.login).toMatchObject({
            status: 'ok',
            message: 'Login correcto',
            data: {
                token: expect.any(String),
            },
        });
    });
});
