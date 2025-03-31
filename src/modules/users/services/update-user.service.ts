// Importamos las dependencias.
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importamos entidad, DTO y servicio de hash.
import { UserEntity } from '../../auth/entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { HashService } from '../../auth/services/hash.service';

// Inicializamos el servicio.
@Injectable()
export class UpdateUserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly hashService: HashService,
    ) {}

    async execute(userId: number, dto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (dto.username) {
            user.username = dto.username;
        }

        if (dto.password || dto.repeatedPass) {
            if (!dto.password || !dto.repeatedPass) {
                throw new BadRequestException(
                    'Debes proporcionar ambas contraseñas',
                );
            }

            if (dto.password !== dto.repeatedPass) {
                throw new BadRequestException('Las contraseñas no coinciden');
            }

            user.password = await this.hashService.hashPassword(dto.password);
        }

        return await this.userRepo.save(user);
    }
}
