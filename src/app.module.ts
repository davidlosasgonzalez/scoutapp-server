// Importamos las dependencias.
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Importamos los módulos propios.
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({})
export class AppModule {
    // Método estático forRoot para configurar dinámicamente el archivo de entorno.
    static forRoot(envFilePath: string): DynamicModule {
        // Eliminamos cualquier valor previo de UPLOADS_DIR para forzar la recarga.
        delete process.env.UPLOADS_DIR;

        return {
            module: AppModule,
            imports: [
                // Configuramos el ConfigModule con la ruta especificada.
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath,
                }),
                // Configuración de TypeORM
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: process.env.MYSQL_HOST,
                    port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
                    username: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASS,
                    database: process.env.MYSQL_DB,
                    entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
                    synchronize: process.env.NODE_ENV === 'test',
                    dropSchema: process.env.NODE_ENV === 'test',
                }),
                // Configuración de GraphQL con Apollo.
                GraphQLModule.forRoot<ApolloDriverConfig>({
                    driver: ApolloDriver,
                    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                    path: '/graphql',
                    context: ({ req }) => ({ user: req.user }),
                }),
                AuthModule,
                UsersModule,
            ],
        };
    }
}
