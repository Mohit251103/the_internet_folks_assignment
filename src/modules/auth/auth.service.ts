import { Snowflake } from "@theinternetfolks/snowflake";
import prisma from "../../config/prisma";
import { SignInData, SignUpData } from "./auth.validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const createUser = async (data: SignUpData) => {
    try {

        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (user) {
            return {
                ok: false,
                error: "RESOURCE_EXISTS"
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const res = await prisma.user.create({
            data: {
                ...data,
                id: Snowflake.generate(),
                password: hashedPassword,
            }
        });
        return {
            ok: true,
            data: {
                id: res.id,
                name: res.name,
                email: res.email,
                created_at: res.createdAt
            }
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            error: error
        }
    }
}

export const authenticateUser = async (data: SignInData) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (!user) {
            return {
                ok: false,
                error: "INVALID_CREDENTIALS_EMAIL"
            };
        }

        const authorized = await bcrypt.compare(data.password, user.password);
        if (!authorized) {
            return {
                ok: false,
                error: "INVALID_CREDENTIALS_PASSWORD"
            }
        }

        return {
            ok: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.createdAt
            }
        };
    } catch (error) {
        return {
            ok: false,
            error: error
        }
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            throw Error("User not found");
        }

        return {
            ok: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.createdAt
            }
        };;
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            error: error
        }
    }
}

export const generateAccessToken = (id: string) => {
    const token = jwt.sign(
        { id },
        process.env.SECRET as string,
        { expiresIn: 24 * 60 * 60 }
    );
    return token;
}