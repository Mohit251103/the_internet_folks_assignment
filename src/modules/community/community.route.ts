import express from "express";
import { createCommunity, getAllCommunity, getAllJoinedCommunities, getAllMembers, getOwnedCommunities } from "./community.controller";
import { get } from "http";

const router = express.Router();

router.post("/", createCommunity);
router.get("/", getAllCommunity);
router.get("/:id/members", getAllMembers);
router.get('/me/owner', getOwnedCommunities);
router.get('/me/member', getAllJoinedCommunities);

export default router;