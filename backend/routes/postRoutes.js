import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postControllers";
import { authGuard, adminGaurd } from "../middleware/authMiddleware";

router
  .route("/")
  .post(authGuard, createPost)
  .get(getAllPosts);
router
  .route("/:slug")
  .put(authGuard, updatePost)
  .delete(authGuard, deletePost)
  .get(getPost);


export default router;
