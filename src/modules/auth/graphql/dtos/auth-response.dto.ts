// Importamos los decoradores de GraphQL.
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthData {
    @Field({ nullable: true })
    id?: number;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    role?: string;

    @Field({ nullable: true })
    token?: string;
}

// Inicializamos el DTO de respuesta para login y registro.
@ObjectType()
export class AuthResponse {
    @Field()
    status: string;

    @Field()
    message: string;

    @Field(() => AuthData, { nullable: true })
    data?: AuthData;
}
