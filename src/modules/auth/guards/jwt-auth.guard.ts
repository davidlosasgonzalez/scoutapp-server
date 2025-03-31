// Importamos las dependencias.
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Inicializamos el guard de autenticación JWT.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
