import { Request, Response } from "express"
import { roleSchema } from "./role.validator"
import { addRole, fetchRoles } from "./role.service";

export const createRole = async (req: Request, res: Response) => {

    const parsedData = roleSchema.safeParse(req.body);
    if (!parsedData.success) {
        const errors = parsedData.error.errors.map((error) => {
            return {
                message: error.message,
                param: error.path,
                code: error.code
            }
        })
        res.status(400).json({
            status: false,
            errors: errors
        });
        return;
    }

    try {

        const response = await addRole(parsedData.data!);
        if (!response.ok) {
            throw Error();
        }
        res.status(200).json({
            status: true,
            content: response.data
        });


    } catch (error: any) {

        res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });


    }
}

export const getRole = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const response = await fetchRoles(page);
        if (!response.ok) {
            throw Error("INTERNAL_SERVER_ERROR");
        }
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: response.data?.count,
                    pages: Math.ceil(response.data?.count!/10),
                    page
                },
                data: response.data?.roles
            }
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
}



