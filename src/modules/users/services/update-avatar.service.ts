// Importamos las dependencias.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

// Importamos el servicio para gestionar la subida de archivos.
import { UploadService } from '../../../shared/services/uploads.service';

// Inicializamos el servicio para actualizar el avatar.
@Injectable()
export class UpdateAvatarService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly uploadService: UploadService, // Inyectamos UploadService
    ) {}

    async execute(userId: number, file: Express.Multer.File): Promise<string> {
        // Buscamos al usuario por ID.
        const user = await this.userRepo.findOne({ where: { id: userId } });

        // Si no se encuentra, lanzamos excepción.
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Usamos UploadService para guardar el archivo; éste usará la variable de entorno UPLOADS_DIR.
        const filename = await this.uploadService.save(file);

        // Asignamos el nuevo avatar y guardamos el usuario.
        user.avatar = filename;
        await this.userRepo.save(user);

        return filename;
    }
}
