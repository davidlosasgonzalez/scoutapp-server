// Importamos las dependencias principales.
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

// Inicializamos y configuramos el entorno de testing.
export const createTestApp = async (): Promise<{
    app: INestApplication;
    dataSource: DataSource;
    httpServer: any;
}> => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const dataSource = app.get(DataSource);

    await dataSource.dropDatabase();
    await dataSource.synchronize();

    await app.init();

    const httpServer = app.getHttpServer();

    return { app, dataSource, httpServer };
};
