// Importamos las dependencias.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importamos la entidad.
import { UserEntity } from '../../auth/entities/user.entity';

// Inicializamos el servicio.
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async getPrivateProfile(userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const { password, ...data } = user;
        return data;
    }
}
