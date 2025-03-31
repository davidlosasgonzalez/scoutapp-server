// Importamos los decoradores de GraphQL.
import { InputType, Field } from '@nestjs/graphql';

// Importamos los decoradores de validación.
import {
    IsEmail,
    IsEnum,
    IsString,
    MinLength,
    IsDateString,
} from 'class-validator';

// Inicializamos el DTO para el registro de usuario.
@InputType()
export class RegisterInput {
    // Nombre de usuario.
    @Field()
    @IsString()
    username: string;

    // Nombre real del usuario.
    @Field()
    @IsString()
    firstName: string;

    // Apellido del usuario.
    @Field()
    @IsString()
    lastName: string;

    // Fecha de nacimiento en formato ISO (yyyy-mm-dd).
    @Field()
    @IsDateString()
    birthDate: string;

    // Correo electrónico válido.
    @Field()
    @IsEmail()
    email: string;

    // Contraseña con mínimo 6 caracteres.
    @Field()
    @MinLength(6)
    password: string;

    // Confirmación de la contraseña.
    @Field()
    @MinLength(6)
    repeatedPass: string;

    // Rol del usuario (family o scout).
    @Field()
    @IsEnum(['family', 'scout'])
    role: 'family' | 'scout';
}
