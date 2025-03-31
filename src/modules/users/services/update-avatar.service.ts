// Importamos las dependencias.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../auth/entities/user.entity';
import { saveUpload } from '../../../shared/utils/save-upload.util';
import { Express } from 'express';

// Inicializamos el servicio.
@Injectable()
export class UpdateAvatarService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly configService: ConfigService,
    ) {}

    async execute(userId: number, file: Express.Multer.File): Promise<string> {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const uploadsDir =
            this.configService.get<string>('UPLOADS_DIR') ?? 'uploads';
        const filename = await saveUpload(file, uploadsDir);

        user.avatar = filename;
        await this.userRepo.save(user);

        return filename;
    }
}
