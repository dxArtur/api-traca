export interface UserDto{
    id?: string;
    name: string;
    nick: string;
    email: string;
    password: string;
    books?: string[];
}

export interface CreateUserDto{
    name: string;
    nick: string;
    email: string;
    password: string;
}

export interface SigninInputrDto{
    email: string;
    password: string;
}