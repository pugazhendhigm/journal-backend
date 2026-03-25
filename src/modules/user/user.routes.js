import { Router } from 'express';
import * as userCtrl from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();
router.use(protect);

router.get('/me', userCtrl.getMe);
router.patch('/me', userCtrl.updateMe);

export default router;