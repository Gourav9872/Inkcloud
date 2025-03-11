import express from "express";
const router = express.Router();
import { createComment, deleteComment, getAllComments, updateComment } from "../controllers/commentControllers";
import { authGuard, adminGaurd } from "../middleware/authMiddleware";

router.route("/").post(authGuard, createComment).get(authGuard,adminGaurd,getAllComments);
router.route("/:commentId").put(authGuard, updateComment ).delete(authGuard, deleteComment);

export default router;
