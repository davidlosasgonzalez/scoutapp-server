// Importamos las dependencias.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Importamos los módulos propios.
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
        }),

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

        // Aquí añadimos el módulo GraphQL
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            path: '/graphql',
            context: ({ req }) => ({ user: req.user }),
        }),

        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
