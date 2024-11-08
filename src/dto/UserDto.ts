import { Follow, Post } from "@prisma/client";

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

export interface author{
    id: string;
    name: string;
    nick: string;
}

export interface sanitizedUserInfo{
    id: string;
    name: string;
    nick: string;
    email: string;
}

export interface sanitizedOutputSignin{
    id: string;
    name: string;
    nick: string;
    email: string;
    followersCount: number;
    postsCount: number;
}