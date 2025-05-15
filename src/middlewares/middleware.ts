import { NextFunction, Request, Response } from "express";

export const isAuthorized = (req:Request, res:Response, next:NextFunction) => {
    const access_token = req.cookies["access_token"];
    if (!access_token) {
        res.status(401).json({
            status: false,
            errors: [
                {
                    message: "You need to be signedin to proceed",
                    code: "NOT_SIGNEDIN"
                }
            ]
        })
        return;
    }

    next();
}