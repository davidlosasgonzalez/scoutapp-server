// Importamos los decoradores de GraphQL.
import { ObjectType, Field } from '@nestjs/graphql';

// Importamos el DTO del usuario.
import { UserGQL } from './user.graphql.dto';

// Definimos la respuesta estándar para operaciones relacionadas con el usuario.
@ObjectType()
export class UserResponse {
    @Field()
    status: string;

    @Field()
    message: string;

    @Field(() => UserGQL, { nullable: true })
    data: UserGQL | null;
}
