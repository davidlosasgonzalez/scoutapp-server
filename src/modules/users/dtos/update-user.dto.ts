// Importamos los decoradores de validación.
import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

// Inicializamos el DTO de actualización de usuario.
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @ValidateIf((o) => o.password !== undefined)
    @IsString()
    @MinLength(6)
    repeatedPass?: string;
}
