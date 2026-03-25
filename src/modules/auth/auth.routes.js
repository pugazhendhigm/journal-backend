import { Router } from 'express';
import * as authController from './auth.controller.js';
import { loginSchema, otpSchema } from './auth.validation.js';
const router = Router();

router.post('/login', loginSchema, authController.login);
router.post('/otp-request', otpSchema, authController.requestOTP);
export default router;