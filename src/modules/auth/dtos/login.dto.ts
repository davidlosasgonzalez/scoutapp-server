// Importamos los decoradores de validación.
import { IsEmail, IsString, MinLength } from 'class-validator';

// Inicializamos el DTO de login.
export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
