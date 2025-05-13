import express from "express"
import { createRole, getRole } from "./role.controller";

const router = express.Router();

router.get("/", getRole);
router.post("/", createRole);

export default router;