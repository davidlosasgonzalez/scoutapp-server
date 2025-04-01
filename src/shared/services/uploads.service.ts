// Importamos las dependencias necesarias.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Inicializamos el servicio encargado de gestionar la subida de archivos.
@Injectable()
export class UploadService {
    constructor(private readonly configService: ConfigService) {}

    async save(file: Express.Multer.File): Promise<string> {
        // Extraemos la extensión del archivo subido.
        const extension = path.extname(file.originalname);

        // Generamos un nombre único para el archivo.
        const filename = `${randomUUID()}${extension}`;

        // Obtenemos la ruta de destino desde variables de entorno.
        const uploadDir =
            this.configService.get<string>('UPLOADS_DIR') ?? 'uploads';

        // Construimos la ruta absoluta del directorio.
        const destination = path.join(process.cwd(), uploadDir);

        // Creamos el directorio si no existe.
        await fs.mkdir(destination, { recursive: true });

        // Guardamos el archivo en el disco.
        await fs.writeFile(path.join(destination, filename), file.buffer);

        return filename;
    }
}
