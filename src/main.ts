// Importamos las dependencias necesarias.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Importamos el filtro global de excepciones.
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Inicializamos la aplicación principal de Nest.
async function bootstrap() {
    // Creamos la instancia de la app a partir del módulo raíz.
    const app = await NestFactory.create(AppModule);

    // Aplicamos el filtro global de excepciones.
    app.useGlobalFilters(new HttpExceptionFilter());

    // Definimos el puerto desde variables de entorno o por defecto.
    const port = process.env.PORT ?? 3000;

    // Iniciamos la aplicación.
    await app.listen(port);

    // Mostramos un mensaje informativo en consola al iniciar correctamente.
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
}

// Ejecutamos la función bootstrap.
bootstrap();
