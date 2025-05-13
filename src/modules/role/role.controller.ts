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
        const response = await fetchRoles();
        if (!response.ok) {
            throw Error();
        }
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: response.data?.length,
                    pages: 1,
                    page: 1
                },
                data: response.data
            }
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
}



