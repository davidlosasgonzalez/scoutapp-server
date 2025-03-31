export interface RegisterResponse {
    id: number;
    email: string;
    role: 'family' | 'scout';
}

export interface LoginResponse {
    token: string;
}
