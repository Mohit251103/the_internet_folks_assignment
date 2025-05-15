import express from "express";
import { addMemberToCommunity, removeMemberFromCommunity } from "./member.controller";

const router = express.Router();

router.post('/', addMemberToCommunity);
router.delete('/:id', removeMemberFromCommunity);

export default router;