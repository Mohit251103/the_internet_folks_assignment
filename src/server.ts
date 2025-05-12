import express, { Request, Response } from "express";
import dotenv from "dotenv"

const app = express();
dotenv.config();

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World!");
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})