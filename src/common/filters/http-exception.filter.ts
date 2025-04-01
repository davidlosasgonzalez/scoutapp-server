// Importamos las dependencias necesarias.
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Capturamos todas las excepciones, tanto HttpException como errores genéricos.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    // Método que se ejecuta cuando ocurre una excepción.
    catch(exception: unknown, host: ArgumentsHost) {
        // Obtenemos el contexto HTTP de la petición.
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Declaramos variables por defecto.
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';

        // Si la excepción es del tipo HttpException (errores controlados).
        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse
            ) {
                const extracted = (exceptionResponse as any).message;
                message = Array.isArray(extracted) ? extracted[0] : extracted;
            }
        }

        // Si no es una HttpException, usamos el mensaje genérico pero logueamos el error para desarrollo.
        else {
            console.error('Error no controlado:', exception);
        }

        // Devolvemos la respuesta en formato uniforme.
        response.status(status).json({
            status: 'error',
            message,
        });
    }
}
