// Importamos las dependencias.
import { Injectable } from '@nestjs/common';

// Importamos servicios.
import { RegisterService } from './register.service';
import { LoginService } from './login.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import {
    RegisterResponse,
    LoginResponse,
} from '../interfaces/auth-response.interface';

// Inicializamos el servicio de autenticación principal.
@Injectable()
export class AuthService {
    constructor(
        private readonly registerService: RegisterService,
        private readonly loginService: LoginService,
    ) {}

    async register(dto: RegisterDto): Promise<RegisterResponse> {
        return await this.registerService.execute(dto);
    }

    async login(dto: LoginDto): Promise<LoginResponse> {
        return await this.loginService.execute(dto);
    }
}
