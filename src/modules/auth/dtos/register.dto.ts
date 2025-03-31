// Importamos los decoradores de validación.
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsDateString,
    MinLength,
} from 'class-validator';

// Inicializamos el DTO de registro.
export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsDateString()
    @IsNotEmpty()
    birthDate: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    repeatedPass: string;

    @IsEnum(['family', 'scout'])
    role: 'family' | 'scout';
}
