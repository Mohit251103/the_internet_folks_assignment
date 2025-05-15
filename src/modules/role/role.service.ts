import prisma from "../../config/prisma";
import { Snowflake } from "@theinternetfolks/snowflake";
import { roleInputType } from "./role.validator";

export const addRole = async ({ name }: roleInputType) => {
    try {
        const res = await prisma.role.create({
            data: {
                id: Snowflake.generate(),
                name: name
            }
        });

        return {
            ok: true,
            data: res
        };
    } catch (error) {
        return {
            ok: false
        };
    }
}

export const fetchRoles = async (page: number) => {
    try {
        const offset = (page - 1) * 10;
        const roles = await prisma.role.findMany({
            skip: offset,
            take: 10
        });
        const count = await prisma.role.count();
        return {
            ok: true,
            data: {
                roles,
                count
            }
        };
    } catch (error: any) {
        return {
            ok: false
        };
    }
}