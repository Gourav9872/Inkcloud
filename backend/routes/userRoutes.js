import express from 'express';
const router= express.Router();
import { loginUser, registerUser, updateProfile, userProfile, updateProfilePicture, getAllUsers, deleteUser} from '../controllers/userControllers';
import { adminGaurd, authGuard } from '../middleware/authMiddleware';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authGuard, userProfile);
router.put('/updateProfile/:userId',authGuard ,updateProfile);
router.put('/updateProfilePicture', authGuard, updateProfilePicture);
router.get('/',authGuard,adminGaurd,getAllUsers);
router.delete('/:userId',authGuard, adminGaurd, deleteUser);

export default router;