// Importamos las dependencias principales.
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';

// Importamos herramientas auxiliares.
import { resetTestDatabase } from '../../utils/reset-db.util';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Inicializamos el test e2e de la query "getMyProfile" en GraphQL.
describe('GraphQL: QUERY getMyProfile (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let token: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        dataSource = moduleRef.get<DataSource>(getDataSourceToken());
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

    it('debería devolver el perfil privado del usuario autenticado', async () => {
        const profileQuery = `
            query {
                getMyProfile {
                    status
                    message
                    data {
                        id
                        username
                        firstName
                        lastName
                        email
                        avatar
                        role
                        createdAt
                        modifiedAt
                    }
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: profileQuery });

        expect(response.status).toBe(200);
        expect(response.body.data.getMyProfile).toMatchObject({
            status: 'ok',
            message: 'Perfil obtenido',
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
