// Importamos las dependencias.
import {
    Injectable,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
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
        // Verificamos si el email ya está en uso.
        const existingByEmail = await this.userRepository.findOne({
            where: { email: dto.email },
        });

        if (existingByEmail) {
            throw new ConflictException('Ya existe una cuenta con este email');
        }

        // Verificamos si el nombre de usuario ya está en uso.
        const existingByUsername = await this.userRepository.findOne({
            where: { username: dto.username },
        });

        if (existingByUsername) {
            throw new ConflictException('El nombre de usuario ya está en uso');
        }

        // Verificamos si las contraseñas coinciden.
        if (dto.password !== dto.repeatedPass) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }

        // Creamos el nuevo usuario con los datos proporcionados.
        const user = this.userRepository.create({
            username: dto.username,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password: await this.hashService.hashPassword(dto.password),
            birthDate: new Date(dto.birthDate),
            role: dto.role,
        });

        // Guardamos el usuario en la base de datos.
        const savedUser = await this.userRepository.save(user);

        // Devolvemos una respuesta simplificada.
        return {
            id: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
        };
    }
}
