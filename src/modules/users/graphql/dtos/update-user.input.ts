// Importamos los decoradores de GraphQL.
import { Field, InputType } from '@nestjs/graphql';

// Importamos los decoradores de validación.
import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

// Inicializamos el DTO para actualizar un usuario en GraphQL.
@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    username?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @Field({ nullable: true })
    @ValidateIf((o) => o.password !== undefined)
    @IsString()
    @MinLength(6)
    repeatedPass?: string;
}
