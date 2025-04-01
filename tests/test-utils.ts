// Importamos las dependencias principales necesarias para testing.
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

// Importamos el filtro global de excepciones personalizado.
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

// Inicializamos y configuramos el entorno de testing.
export const createTestApp = async (): Promise<{
    app: INestApplication;
    dataSource: DataSource;
    httpServer: any;
}> => {
    // Compilamos el módulo principal de la app.
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    // Creamos la instancia de la aplicación Nest.
    const app = moduleRef.createNestApplication();

    // Aplicamos los pipes globales para validación.
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Elimina propiedades no definidas en los DTOs.
        }),
    );

    // Registramos el filtro global de excepciones personalizado.
    app.useGlobalFilters(new HttpExceptionFilter());

    // Obtenemos la fuente de datos (base de datos) para los tests.
    const dataSource = app.get(DataSource);

    // Limpiamos y sincronizamos la base de datos de test antes de iniciar.
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    // Iniciamos la aplicación Nest.
    await app.init();

    // Obtenemos el servidor HTTP que usaremos en los tests.
    const httpServer = app.getHttpServer();

    // Retornamos todo lo necesario para los tests: app, base de datos y servidor HTTP.
    return { app, dataSource, httpServer };
};
