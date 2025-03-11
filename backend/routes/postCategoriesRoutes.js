import express from 'express';
const router= express.Router();
import { createPostCategory, deletePostCategory, getAllPostCategories, getSingleCategory, updatePostCategory } from '../controllers/postCategoriesControllers';
import { authGuard , adminGaurd} from '../middleware/authMiddleware';

router.route("/").post(authGuard, adminGaurd, createPostCategory).get(getAllPostCategories);
router.route("/:postCategoryId").get(getSingleCategory).put(authGuard, adminGaurd, updatePostCategory).delete(authGuard,adminGaurd,deletePostCategory);
export default router;