import { Request, Response } from "express";
import { addMember, deleteMember, isAdmin } from "./member.service";
import { AddMemberSchema } from "./member.validator";
import { getDataFromAccessToken } from "../../utils/getDataFromAccessToken";


export const addMemberToCommunity = async (req: Request, res: Response) => {
    const parsedData = AddMemberSchema.safeParse(req.body);
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
        const { id } = getDataFromAccessToken(access_token);
        const admin = await isAdmin({community: parsedData.data.community, user: id});
        if (!admin.ok) {
            throw Error("NOT_ALLOWED_ACCESS");
        }

        const response = await addMember(parsedData.data);
        if (!response.ok) {
            if (response.error === "RESOURCE_EXISTS") {
                throw Error("RESOURCE_EXISTS");
            }

            if (response.error === "RESOURCE_NOT_FOUND") {
                throw Error(`RESOURCE_NOT_FOUND ${response.param}`);
            }
        }

        res.status(200).json({
            status: true,
            content: {
                data: response.data
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            const err = error.message.split(" ");
            if (err[0] === "RESOURCE_EXISTS") {
                res.status(400).json({
                    "status": false,
                    "errors": [
                        {
                            message: "User is already added in the community.",
                            code: "RESOURCE_EXISTS"
                        }
                    ]
                });
            }
            else if (err[0] === "RESOURCE_NOT_FOUND") {
                res.status(400).json({
                    status: false,
                    errors: [
                        {
                            param: err[1],
                            message: `${err[1].charAt(0).toUpperCase()+err[1].slice(1)} not found`,
                            code: "RESOURCE_NOT_FOUND"
                        }
                    ]
                });
            }
            else {
                res.status(400).json({
                    status: false,
                    errors: [
                        {
                            message: "You are not authorized to perform this action.",
                            code: "NOT_ALLOWED_ACCESS"
                        }
                    ]
                });
            }
        }
        else {
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
}


export const removeMemberFromCommunity = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await deleteMember(id);
        if (!response.ok) {
            throw Error("INTERNAL_SERVER_ERROR");
        }
        res.status(200).json({
            status: true
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