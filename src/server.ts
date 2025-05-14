import express, { Request, Response } from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import roleRouter from "./modules/role/role.route";
import authRouter from "./modules/auth/auth.route"

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
cors({
    credentials: true
});
app.use(cookieParser());

app.use('/v1/role', roleRouter);
app.use('/v1/auth', authRouter);

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})