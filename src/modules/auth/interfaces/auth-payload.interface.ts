// Inicializamos la interfaz para el payload JWT.
export interface AuthPayload {
    userId: number;
    role: 'family' | 'scout';
}
