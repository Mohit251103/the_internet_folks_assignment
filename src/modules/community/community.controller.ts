import { Request, Response } from "express";
import { CommunityInputSchema } from "./community.validator";
import { addCommunity, getCommunities, getMembers, getMyCommunities, getMyJoinedCommunities } from "./community.service";
import { getDataFromAccessToken } from "../../utils/getDataFromAccessToken";


export const createCommunity = async (req: Request, res: Response) => {
    const parsedData = CommunityInputSchema.safeParse(req.body);
    if (!parsedData.success) {
        const errors = parsedData.error.errors.map((error) => {
            return {
                message: error.message,
                param: error.path,
                code: "INVALID_INPUT"
            }
        })
        res.status(400).json({
            status: false,
            errors: errors
        });
        return;
    }

    try {

        const access_token = req.cookies["access_token"];
        const response = await addCommunity(parsedData.data.name, access_token);
        if (!response.ok) {
            throw Error();
        }

        res.status(200).json({
            status: true,
            content: {
                data: response.data
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            errors: [
                {
                    param: "server",
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        })
    }
}


export const getAllCommunity = async (req: Request, res: Response) => {
    try {
        const response = await getCommunities();
        if (!response.ok) {
            throw Error();
        }

        res.status(200).json({
            status: true, 
            content: {
                meta: {
                    total: response.data?.length,
                    pages: Math.ceil(response.data?.length! / 10),
                    page: 1
                },
                data: response.data
            }
        })
    } catch (error) {
        res.status(500).json({
            status: true,
            errors: [
                {
                    param: "server",
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        })
    }
}


export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const response = await getMembers(req.params.id);
        if (!response.ok) {
            throw Error();
        }

        res.status(200).json({
            status: true,
            content: {
                "meta": {
                    "total": response.data?.length,
                    "pages": 1,
                    "page": 1
                },
                "data": response.data
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: [
                {
                    param: "server",
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        })
    }
}


export const getOwnedCommunities = async (req: Request, res: Response) => {
    try {
        const access_token = req.cookies["access_token"];
        const { id } = getDataFromAccessToken(access_token);
        const communities = await getMyCommunities(id);
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: communities.data?.length,
                    pages: Math.ceil(communities.data?.length! / 10),
                    page: 1
                },
                data: communities.data
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: [
                {
                    param: "server",
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        })
    }
}

export const getAllJoinedCommunities = async (req: Request, res: Response) => {
    try {
        const access_token = req.cookies["access_token"];
        const { id } = getDataFromAccessToken(access_token);
        const communities = await getMyJoinedCommunities(id);
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: communities.data?.length,
                    pages: Math.ceil(communities.data?.length! / 10),
                    page: 1
                },
                data: communities.data
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: [
                {
                    param: "server",
                    message: "Internal Server Error",
                    code: "SERVER_ERROR"
                }
            ]
        })
    }
}