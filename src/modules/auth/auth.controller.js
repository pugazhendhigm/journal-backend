import * as authService from './auth.service.js';
import { sendResponse } from '../../utils/response.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await authService.signInWithEmail(email, password);
    if (error) throw error;
    sendResponse(res, 200, true, { user: data.user, token: data.session.access_token });
  } catch (e) { next(e); }
};

export const requestOTP = async (req, res, next) => {
  try {
    await authService.sendOTP(req.body.email);
    sendResponse(res, 200, true, null, 'OTP sent to email');
  } catch (e) { next(e); }
};