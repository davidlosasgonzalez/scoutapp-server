// Importamos los decoradores de GraphQL.
import { Field, InputType } from '@nestjs/graphql';

// Importamos los decoradores de validación.
import { IsEmail, MinLength } from 'class-validator';

// Inicializamos el DTO para el login de usuario.
@InputType()
export class LoginInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @MinLength(6)
    password: string;
}
