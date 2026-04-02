import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/requests", sendFriendRequest);
router.post("/requests/:requestID/accept", acceptFriendRequest);
router.post("/requests/:requestID/decline", declineFriendRequest);
router.get("/", getAllFriends);
router.get("/requests", getFriendRequests);

export default router;
