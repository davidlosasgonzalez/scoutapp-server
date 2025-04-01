// Importamos las dependencias necesarias.
import { Module } from '@nestjs/common';
import { UploadService } from './services/uploads.service';

// Inicializamos el módulo compartido que exportará utilidades comunes.
@Module({
    providers: [UploadService],
    exports: [UploadService],
})
export class SharedModule {}
