// Importamos las dependencias.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos el controlador y servicios.
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UpdateAvatarService } from './services/update-avatar.service';
import { UpdateUserService } from './services/update-user.service';

// Importamos el módulo.
import { AuthModule } from '../auth/auth.module';

// Importamos el resolver de GraphQL.
import { UsersResolver } from './graphql/users.resolver';

// Importamos la entidad del usuario.
import { UserEntity } from '../auth/entities/user.entity';

// Inicializamos el módulo.
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        UpdateAvatarService,
        UpdateUserService,
        UsersResolver,
    ],
})
export class UsersModule {}
