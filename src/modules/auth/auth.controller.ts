import { Request, Response } from "express";
import { SignInSchema, SignUpSchema } from "./auth.validator";
import { authenticateUser, createUser, generateAccessToken, getUserById } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { getDataFromAccessToken } from "../../utils/getDataFromAccessToken";


export const SignUp = async (req: Request, res: Response) => {
    const parsedData = SignUpSchema.safeParse(req.body);
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
        const response = await createUser(parsedData.data);
        if (!response.ok) {
            if (response.error === "RESOURCE_EXISTS") {
                throw Error("RESOURCE_EXISTS");
            }
            throw Error();
        }

        const access_token = generateAccessToken(response.data!.id);
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        })

        res.status(200).json({
            status: true,
            content: {
                data: response.data,
                meta: {
                    access_token
                }
            }
        })
    } catch (error) {
        if (error instanceof Error && error.message === "RESOURCE_EXISTS") {
            res.status(400).json({
                status: false,
                errors: [
                    {
                        param: "email",
                        message: "User with this email address already exists.",
                        code: "RESOURCE_EXISTS"
                    }
                ]
            })
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
            });
        }
    }
}


export const SignIn = async (req: Request, res: Response) => {
    const parsedData = SignInSchema.safeParse(req.body);
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
        const response = await authenticateUser(parsedData.data);
        if (!response.ok) {
            if (response.error === "INVALID_CREDENTIALS_EMAIL"
                || response.error === "INVALID_CREDENTIALS_PASSWORD") {
                throw Error(response.error);
            }
            throw Error();
        }

        const access_token = generateAccessToken(response.data!.id);
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        })

        res.status(200).json({
            status: true,
            content: {
                data: response.data,
                meta: {
                    access_token
                }
            }
        })
    } catch (error) {
        if (error instanceof Error &&
            (error.message === "INVALID_CREDENTIALS_EMAIL"
                || error.message === "INVALID_CREDENTIALS_PASSWORD")) {
            res.status(400).json({
                status: false,
                errors: [
                    {
                        param: error.message === "INVALID_CREDENTIALS_EMAIL" ? "email" : "password",
                        message: "The credentials you provided are invalid.",
                        code: "INVALID_CREDENTIALS"
                    }
                ]
            })
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
            });
        }
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const access_token = req.cookies["access_token"];
        if (!access_token) {
            throw Error("NOT_SIGNEDIN");
        }
        const data: JwtPayload = getDataFromAccessToken(access_token);
        const getUser = await getUserById(data.id);

        if (!getUser.ok) {
            throw Error();
        }

        res.status(200).json({
            status: true,
            content: {
                data: getUser.data
            }
        })

    } catch (error) {
        if (error instanceof Error && error.message==="NOT_SIGNEDIN") {
            res.status(401).json({
                status: false,
                errors: [
                    {
                        "message": "You need to sign in to proceed.",
                        "code": "NOT_SIGNEDIN"
                    }
                ]
            });
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
            });
        }
    }
}



