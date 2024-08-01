export interface UserDto{
    id?: string;
    name: string;
    nick: string;
    email: string;
    password: string;
}

export interface CreateUserDto{
    name: string;
    nick: string;
    email: string;
    password: string;
}

export interface SigninUserDto{
    email: string;
    password: string;
}