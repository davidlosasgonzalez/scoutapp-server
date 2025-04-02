// Importamos las dependencias.
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthPayload } from '@/modules/auth/interfaces/auth-payload.interface';

// Inicializamos el decorador personalizado.
export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): AuthPayload => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.user;
    },
);
