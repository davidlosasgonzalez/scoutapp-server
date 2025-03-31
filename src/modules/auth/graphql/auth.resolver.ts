// Importamos las dependencias de NestJS y GraphQL.
import { Resolver, Mutation, Args } from '@nestjs/graphql';

// Importamos el servicio principal de autenticación.
import { AuthService } from '../services/auth.service';

// Importamos los DTOs para GraphQL.
import { RegisterInput } from './dtos/register.graphql.input';
import { LoginInput } from './dtos/login.graphql.input';
import { AuthResponse } from './dtos/auth-response.dto';

// Inicializamos el resolver para el módulo de autenticación.
@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    // Definimos la mutación para registrar un nuevo usuario.
    @Mutation(() => AuthResponse)
    async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
        const result = await this.authService.register(input);

        return {
            status: 'ok',
            message: 'Usuario registrado',
            data: {
                id: result.id,
                email: result.email,
                role: result.role,
            },
        };
    }

    // Definimos la mutación para iniciar sesión.
    @Mutation(() => AuthResponse)
    async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
        const result = await this.authService.login(input);

        return {
            status: 'ok',
            message: 'Login correcto',
            data: {
                token: result.token,
            },
        };
    }
}
