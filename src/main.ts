// Importamos las dependencias necesarias.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    // Seleccionamos el archivo de entorno según NODE_ENV.
    const envFilePath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

    // Creamos la instancia de la app a partir del módulo raíz dinámico.
    const app = await NestFactory.create(AppModule.forRoot(envFilePath));

    app.useGlobalFilters(new HttpExceptionFilter());

    const port = process.env.PORT ?? 3001;

    await app.listen(port);

    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
}

bootstrap();
