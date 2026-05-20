import * as authService from './auth.service.js';
import { sendResponse } from '../../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.signUp(req.body.email, req.body.password);
    const statusCode = result.pendingVerification ? 202 : 201;
    sendResponse(res, statusCode, true, result.user, result.message);
  } catch (e) { next(e); }
};

export const verifyRegister = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { data, error } = await authService.verifyEmailOTP(email, otp);
    if (error) throw error;
    sendResponse(res, 200, true, { user: data.user, session: data.session }, 'Email verified successfully');
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await authService.signInWithEmail(email, password);
    if (error) throw error;
    sendResponse(res, 200, true, { user: data.user, token: data.session.access_token });
  } catch (e) { next(e); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { error } = await authService.sendResetPasswordOTP(req.body.email);
    if (error) throw error;
    sendResponse(res, 200, true, null, 'Reset OTP sent to email');
  } catch (e) { next(e); }
};

export const resetPasswordVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { data, error } = await authService.verifyResetOTP(email, otp);
    if (error) throw error;
    sendResponse(res, 200, true, { session: data.session }, 'OTP verified');
  } catch (e) { next(e); }
};

export const setNewPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { data, error } = await authService.updatePassword(password);
    if (error) throw error;
    sendResponse(res, 200, true, null, 'Password updated successfully');
  } catch (e) { next(e); }
};

export const resendVerificationOTP = async (req, res, next) => {
  try {
    const { email, type } = req.body;
    const { error } = await authService.resendOTP(email, type);
    if (error) throw error;
    sendResponse(res, 200, true, null, 'OTP resent successfully');
  } catch (e) { next(e); }
};
