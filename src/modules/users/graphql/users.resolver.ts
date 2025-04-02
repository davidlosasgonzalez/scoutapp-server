// Importamos las dependencias.
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

// Importamos servicios.
import { UsersService } from '../services/users.service';
import { UpdateUserService } from '../services/update-user.service';

// Importamos DTOs.
import { UpdateUserInput } from './dtos/update-user.input';
import { UserGQL } from './dtos/user.graphql.dto';
import { UserResponse } from './dtos/user-response.dto';

// Importamos el guard y decorador de autenticación.
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';

// Importamos el tipo del payload JWT.
import { AuthPayload } from '../../auth/interfaces/auth-payload.interface';

// Inicializamos el resolver para GraphQL.
@Resolver(() => UserGQL)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly updateUserService: UpdateUserService,
    ) {}

    // Consulta del perfil privado del usuario autenticado.
    @UseGuards(GqlAuthGuard)
    @Query(() => UserResponse)
    async getMyProfile(
        @CurrentUser() user: AuthPayload,
    ): Promise<UserResponse> {
        const profile = await this.usersService.getPrivateProfile(user.sub);

        return {
            status: 'ok',
            message: 'Perfil obtenido',
            data: profile,
        };
    }

    // Mutación para actualizar username o contraseña del usuario autenticado.
    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserResponse)
    async updateMyUser(
        @CurrentUser() user: AuthPayload,
        @Args('input') input: UpdateUserInput,
    ): Promise<UserResponse> {
        const updated = await this.updateUserService.execute(user.sub, input);

        return {
            status: 'ok',
            message: 'Usuario actualizado',
            data: updated,
        };
    }
}
