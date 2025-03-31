// Importamos las dependencias.
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importamos el controlador.
import { AuthController } from './controllers/auth.controller';

// Importamos las entidades.
import { UserEntity } from './entities/user.entity';

// Importamos los servicios.
import { AuthService } from './services/auth.service';
import { HashService } from './services/hash.service';
import { RegisterService } from './services/register.service';
import { LoginService } from './services/login.service';

// Importamos la estrategia y el resolver.
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './graphql/auth.resolver';

// Inicializamos el módulo de autenticación.
@Module({
    imports: [
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        HashService,
        RegisterService,
        LoginService,
        JwtStrategy,
        AuthResolver,
    ],
    exports: [HashService],
})
export class AuthModule {}
