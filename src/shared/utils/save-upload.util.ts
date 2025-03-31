// Importamos las dependencias.
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Express } from 'express';

// Inicializamos la función de guardado de archivos.
export async function saveUpload(
    file: Express.Multer.File,
    uploadDir: string,
): Promise<string> {
    const extension = path.extname(file.originalname);
    const filename = `${randomUUID()}${extension}`;
    const destination = path.join(process.cwd(), uploadDir);

    await fs.mkdir(destination, { recursive: true });
    await fs.writeFile(path.join(destination, filename), file.buffer);

    return filename;
}
