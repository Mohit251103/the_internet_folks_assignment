import jwt from "jsonwebtoken";
export const getDataFromAccessToken = (token: string): jwt.JwtPayload => {
    const data = jwt.decode(token);

    if (!data || typeof data === "string") {
        throw new Error("Invalid token payload");
    }

    return data;
}