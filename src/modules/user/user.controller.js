import * as userService from './user.service.js';
import { sendResponse } from '../../utils/response.js';

export const getMe = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    sendResponse(res, 200, true, profile);
  } catch (e) { next(e); }
};

export const updateMe = async (req, res, next) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    sendResponse(res, 200, true, profile, 'Profile updated');
  } catch (e) { next(e); }
};