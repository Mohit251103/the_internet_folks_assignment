import prisma from "../../config/prisma";
import { Snowflake } from "@theinternetfolks/snowflake";
import { RoleName } from "./role.validator";

export const addRole = async ({ name }: { name: RoleName }) => {
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

export const fetchRoles = async () => {
    try {
        const res = await prisma.role.findMany();
        return {
            ok: true,
            data: res
        };
    } catch (error: any) {
        return {
            ok: false
        };
    }
}