import express, { Request, Response } from "express";
import roleController from "./modules/role/role.route";
import dotenv from "dotenv"

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/role', roleController);

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})