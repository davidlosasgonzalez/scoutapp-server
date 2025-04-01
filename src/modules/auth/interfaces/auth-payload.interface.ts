// Inicializamos la interfaz para el payload JWT.
export interface AuthPayload {
    sub: number;
    role: 'family' | 'scout';
}
