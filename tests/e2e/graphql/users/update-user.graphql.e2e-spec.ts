// Importamos las dependencias principales.
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';

// Importamos herramientas auxiliares.
import { resetTestDatabase } from '../../utils/reset-db.util';

// Inicializamos el test e2e de la mutación "updateMyUser" en GraphQL.
describe('GraphQL: MUTATION updateMyUser (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let token: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule.forRoot('.env.test')],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        dataSource = app.get<DataSource>(DataSource);
        await resetTestDatabase(dataSource);

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
                    data { id }
                }
            }
        `;

        await request(app.getHttpServer())
            .post('/graphql')
            .send({ query: registerQuery });

        const loginQuery = `
            mutation {
                login(input: {
                    email: "jose.ramon@gmail.com",
                    password: "Hackaboss17!"
                }) {
                    data {
                        token
                    }
                }
            }
        `;

        const loginResponse = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query: loginQuery });

        token = loginResponse.body.data.login.data.token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('debería actualizar el nombre de usuario vía GraphQL', async () => {
        const updateQuery = `
            mutation {
                updateMyUser(input: {
                    username: "josinho_updated"
                }) {
                    status
                    message
                    data {
                        id
                        username
                    }
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: updateQuery });

        expect(response.status).toBe(200);
        expect(response.body.data.updateMyUser).toMatchObject({
            status: 'ok',
            message: 'Usuario actualizado',
            data: {
                id: expect.any(Number),
                username: 'josinho_updated',
            },
        });
    });

    it('debería actualizar la contraseña correctamente', async () => {
        const updatePasswordQuery = `
            mutation {
                updateMyUser(input: {
                    password: "NuevaPassword123!",
                    repeatedPass: "NuevaPassword123!"
                }) {
                    status
                    message
                    data {
                        id
                        username
                    }
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: updatePasswordQuery });

        expect(response.status).toBe(200);
        expect(response.body.data.updateMyUser).toMatchObject({
            status: 'ok',
            message: 'Usuario actualizado',
            data: {
                id: expect.any(Number),
                username: 'josinho_updated',
            },
        });
    });

    it('debería lanzar error si las contraseñas no coinciden', async () => {
        const updatePasswordQuery = `
            mutation {
                updateMyUser(input: {
                    password: "NuevaPassword123!",
                    repeatedPass: "OtraPassword123!"
                }) {
                    status
                    message
                    data {
                        id
                        username
                    }
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: updatePasswordQuery });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBe(
            'Las contraseñas no coinciden',
        );
    });
});
