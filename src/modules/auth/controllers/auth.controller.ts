// Importamos las dependencias.
import { Body, Controller, Post, HttpCode } from '@nestjs/common';

// Importamos los DTOs.
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

// Importamos el servicio de autenticación.
import { AuthService } from '../services/auth.service';

// Inicializamos el controlador.
@Controller('api/users')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const result = await this.authService.register(dto);

        return {
            status: 'ok',
            message: 'Usuario registrado',
            data: result,
        };
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() dto: LoginDto) {
        const result = await this.authService.login(dto);
        return {
            status: 'ok',
            message: 'Login correcto',
            data: result,
        };
    }
}
