// Importamos las dependencias.
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Inicializamos el servicio de hash.
@Injectable()
export class HashService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed);
    }
}
