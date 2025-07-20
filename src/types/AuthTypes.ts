import type { User } from "./User";

export interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}


export interface AuthResponse {
    user: User;
    accessToken: string;
}

