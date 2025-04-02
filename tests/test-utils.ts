// Importamos las dependencias principales necesarias para testing.
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';

// Importamos el filtro global de excepciones personalizado.
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

// Inicializamos y configuramos el entorno de testing.
export const createTestApp = async (): Promise<{
    app: INestApplication;
    dataSource: DataSource;
    httpServer: any;
}> => {
    // Compilamos el módulo principal de la app usando AppModule.forRoot con '.env.test'.
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule.forRoot('.env.test')],
    }).compile();

    // Creamos la instancia de la aplicación Nest.
    const app = moduleRef.createNestApplication();

    // Aplicamos los pipes globales para validación.
    app.useGlobalPipes(
        new ValidationPipe({
            // Elimina propiedades no definidas en los DTOs.
            whitelist: true,
        }),
    );

    // Registramos el filtro global de excepciones personalizado.
    app.useGlobalFilters(new HttpExceptionFilter());

    // Iniciamos la aplicación Nest.
    await app.init();

    // Obtenemos el servidor HTTP que usaremos en los tests.
    const httpServer = app.getHttpServer();

    // Obtenemos la fuente de datos directamente por su clase.
    const dataSource = app.get<DataSource>(DataSource);

    // Retornamos todo lo necesario para los tests: app, base de datos y servidor HTTP.
    return { app, dataSource, httpServer };
};
