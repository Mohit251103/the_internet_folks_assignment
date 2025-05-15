import { JwtPayload } from "jsonwebtoken";
import prisma from "../../config/prisma";
import { getDataFromAccessToken } from "../../utils/getDataFromAccessToken";
import { Snowflake } from "@theinternetfolks/snowflake";

const generateSlug = (name: string) => {
    const slug = name.toLowerCase().split(" ").join("-");
    return slug;
}

export const addCommunity = async (name: string, token: string) => {
    try {
        const data: JwtPayload = getDataFromAccessToken(token);
        const user = await prisma.user.findUnique({
            where: {
                id: data.id
            }
        });
        if (!user) {
            throw Error("User does not exist");
        }

        var slug = generateSlug(name);
        slug = slug.concat(String(Snowflake.generate()));

        const community = await prisma.community.create({
            data: {
                id: Snowflake.generate(),
                name: name,
                slug: slug,
                ownerId: data.id
            }
        });

        const role = await prisma.role.findUnique({
            where: {
                name: "Community Admin"
            }
        });

        if (!role) {
            throw Error("Invalid Role");
        }

        const member = await prisma.member.create({
            data: {
                id: Snowflake.generate(),
                communityId: community.id,
                userId: user.id,
                roleId: role.id
            }
        })

        return {
            ok: true,
            data: {
                id: community.id,
                name: community.name,
                slug: community.slug,
                owner: community.ownerId,
                created_at: community.createdAt,
                updated_at: community.updatedAt
            }
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false
        }
    }
}

export const getCommunities = async (page:number) => {
    try {
        const offset = (page - 1) * 10;
        const communities = await prisma.community.findMany({
            omit: {
                ownerId: true
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            skip: offset,
            take: 10
        });

        const count = await prisma.community.count();
        return {
            ok: true,
            data: {
                communities,
                count 
            }
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false
        };
    }
}

export const getMembers = async (slug: string, page: number) => {
    try {
        const offset = (page - 1) * 10;
        const members = await prisma.member.findMany({
            where: {
                community: {
                    slug: slug
                }
            },
            omit: {
                userId: true,
                roleId: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            skip: offset,
            take: 10
        });

        const count = await prisma.member.count({
            where: {
                community: {
                    slug: slug
                }
            }
        });

        const res = members.map(member => {
            return {
                id: member.id,
                community: member.communityId,
                user: member.user,
                role: member.role,
                created_at: member.createdAt
            }
        })

        return {
            ok: true,
            data: {
                members: res,
                count
            }
        }
    } catch (error) {
        return {
            ok: false
        }
    }
}

export const getMyCommunities = async (id: string, page: number) => {
    try {
        const offset = (page - 1) * 10;
        const communities = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                communitiesOwned: {
                    skip: offset,
                    take: 10
                }
            }
        })

        const allOwnedCommunities = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                communitiesOwned: true
            }
        });

        const response = communities?.communitiesOwned.map((community) => {
            return {
                id: community.id,
                name: community.name,
                slug: community.slug,
                owner: community.ownerId,
                created_at: community.createdAt,
                updated_at: community.updatedAt
            }
        });
        return {
            ok: true,
            data: {
                owned_communities: response,
                count: allOwnedCommunities?.communitiesOwned.length
            }
        }
    } catch (error) {
        return {
            ok: false,
            error: error
        }
    }
}

export const getMyJoinedCommunities = async (id: string, page: number) => {
    try {
        const offset = (page - 1) * 10;
        const joinedCommunities = await prisma.community.findMany({
            where: {
                members: {
                    some: {
                        userId: id
                    }
                }
            },
            omit: {
                ownerId: true
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            skip: offset,
            take: 10
        });

        const count = await prisma.community.count({
            where: {
                members: {
                    some: {
                        userId: id
                    }
                }
            }
        });

        const response = joinedCommunities.map((community) => {
            return {
                id: community.id,
                name: community.name,
                slug: community.slug,
                owner: community.owner,
                created_at: community.createdAt,
                updated_at: community.updatedAt
            }
        })

        return {
            ok: true,
            data: {
                joined_communities: response,
                count
            }
        };
    } catch (error) {
        return {
            ok: false,
            error: error
        };
    }
}