// Importamos las dependencias.
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

// Importamos entidad, DTO y servicio de hash.
import { UserEntity } from '../entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { HashService } from './hash.service';

// Importamos tipos.
import { LoginResponse } from '../interfaces/auth-response.interface';

// Inicializamos el servicio de login.
@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
    ) {}

    async execute(dto: LoginDto): Promise<LoginResponse> {
        const invalidCredentialsMsg = 'Credenciales inválidas';

        const user = await this.userRepository.findOne({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException(invalidCredentialsMsg);
        }

        const isValid = await this.hashService.comparePasswords(
            dto.password,
            user.password,
        );

        if (!isValid) {
            throw new UnauthorizedException(invalidCredentialsMsg);
        }

        const payload: { sub: number; role: string } = {
            sub: user.id,
            role: user.role,
        };

        const token: string = this.jwtService.sign(payload);

        return { token };
    }
}
