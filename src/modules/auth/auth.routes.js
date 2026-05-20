import { Router } from 'express';
import * as authController from './auth.controller.js';
import { loginSchema, otpSchema, passwordSchema } from './auth.validation.js';

const router = Router();

router.post('/signup', loginSchema, authController.register);
router.post('/verify-email', otpSchema, authController.verifyRegister);
router.post('/login', loginSchema, authController.login);
router.post('/resend-otp', otpSchema, authController.resendVerificationOTP);

router.post('/forgot-password', otpSchema, authController.forgotPassword);
router.post('/verify-reset-otp', otpSchema, authController.resetPasswordVerify);
router.post('/set-new-password', passwordSchema, authController.setNewPassword);

export default router;