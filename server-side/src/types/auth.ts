export interface LoginBody {
    email: string;
    password: string;
}

export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export interface LoginRes {
    success: boolean;
    status: number;
    message: string;
    data?: {
        id: string;
        email: string;
    };
    token?: string;
}

export interface RegisterRes {
    success: boolean;
    status: number;
    message: string;
    data?: {
        email: string;
        username: string;
    };
    token?: string;
}
