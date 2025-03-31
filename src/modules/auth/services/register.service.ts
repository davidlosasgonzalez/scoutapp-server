// Importamos las dependencias.
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importamos entidad, DTO y servicio de hash.
import { UserEntity } from '../entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';
import { HashService } from './hash.service';

// Importamos tipos.
import { RegisterResponse } from '../interfaces/auth-response.interface';

// Inicializamos el servicio de registro.
@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly hashService: HashService,
    ) {}

    async execute(dto: RegisterDto): Promise<RegisterResponse> {
        const existing = await this.userRepository.findOne({
            where: [{ email: dto.email }, { username: dto.username }],
        });

        if (existing) {
            throw new BadRequestException('El usuario ya existe');
        }

        if (dto.password !== dto.repeatedPass) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }

        const user = this.userRepository.create({
            username: dto.username,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password: await this.hashService.hashPassword(dto.password),
            birthDate: new Date(dto.birthDate),
            role: dto.role,
        });

        const savedUser = await this.userRepository.save(user);

        return {
            id: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
        };
    }
}
