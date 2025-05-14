import express from "express"
import { getMe, SignIn, SignUp } from "./auth.controller";

const router = express.Router();

router.post('/signup', SignUp);
router.post('/signin', SignIn);
router.get('/me', getMe);

export default router;