// Importamos los decoradores de GraphQL.
import { Field, ObjectType, Int } from '@nestjs/graphql';

// Inicializamos el DTO para representar a un usuario en GraphQL.
@ObjectType()
export class UserGQL {
    @Field(() => Int)
    id: number;

    @Field()
    username: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field()
    role: string;

    @Field()
    createdAt: Date;

    @Field()
    modifiedAt: Date;
}
