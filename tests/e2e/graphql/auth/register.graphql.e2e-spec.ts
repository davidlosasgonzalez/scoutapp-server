// Importamos las dependencias principales.
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';

// Importamos herramientas auxiliares.
import { resetTestDatabase } from '../../utils/reset-db.util';

// Inicializamos el test e2e de la mutación "register" en GraphQL.
describe('GraphQL: MUTATION register (e2e)', () => {
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
    });

    afterAll(async () => {
        await app.close();
    });

    // Test principal: registrar un usuario usando GraphQL.
    it('debería registrar un usuario nuevo vía GraphQL', async () => {
        const query = `
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
                        email
                        role
                    }
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query });

        expect(response.status).toBe(200);

        // Validación de estructura completa
        expect(response.body.data.register).toMatchObject({
            status: 'ok',
            message: 'Usuario registrado',
            data: {
                id: expect.any(Number),
                email: 'jose.ramon@gmail.com',
                role: 'family',
            },
        });
    });
});
