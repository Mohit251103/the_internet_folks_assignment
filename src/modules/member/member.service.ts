import { Snowflake } from "@theinternetfolks/snowflake";
import prisma from "../../config/prisma";
import { MemberData } from "./member.validator";


export const addMember = async (data: MemberData) => {
    try {

        const community = await prisma.community.findUnique({
            where: {
                id: data.community
            }
        });

        if (!community) {
            return {
                ok: false,
                param: "community",
                error: "RESOURCE_NOT_FOUND_COMMUNITY"
            }
        }

        const role = await prisma.role.findUnique({
            where: {
                id: data.role
            }
        });

        if (!role) {
            return {
                ok: false,
                param: "role",
                error: "RESOURCE_NOT_FOUND"
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                id: data.user
            }
        });

        if (!user) {
            return {
                ok: false,
                param: "user",
                error: "RESOURCE_NOT_FOUND"
            }
        }

        const alreadyMember = await prisma.community.findUnique({
            where: {
                id: data.community,
                members: {
                    some: {
                        userId: data.user
                    }
                }
            }
        });

        if (alreadyMember) {
            return {
                ok: false,
                error: "RESOURCE_EXISTS"
            }
        };

        const member = await prisma.member.create({
            data: {
                id: Snowflake.generate(),
                communityId: data.community,
                userId: data.user,
                roleId: data.role
            }
        });

        return {
            ok: true,
            data: {
                id: member.id,
                community: member.communityId,
                role: member.roleId,
                user: member.userId,
                created_at: member.createdAt
            }
        };
    } catch (error) {
        return {
            ok: false,
            error: error
        };
    }
}

export const deleteMember = async (memberId: string) => {
    try {
        await prisma.member.delete({
            where: {
                id: memberId
            }
        });
        return {
            ok: true
        }
    } catch (error) {
        return {
            ok: false,
            error
        }
    }
}


export const isAdmin = async (data: {community: string, user: string}) => {
    try {
        const isAdmin = await prisma.community.findUnique({
            where: {
                id: data.community,
                ownerId: data.user
            }
        });

        if (!isAdmin) {
            return {
                ok: false
            };
        }

        return {
            ok: true
        };
    } catch (error) {
        return {
            ok: false,
            error: error
        };
    }
}