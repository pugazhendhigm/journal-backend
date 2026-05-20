import { supabase } from '../../config/supabase.js';

export const signUp = (email, password) => 
  supabase.auth.signUp({ email, password });

export const verifyEmailOTP = (email, token) => 
  supabase.auth.verifyOtp({ email, token, type: 'signup' });

export const signInWithEmail = (email, password) => 
  supabase.auth.signInWithPassword({ email, password });

export const sendResetPasswordOTP = (email) => 
  supabase.auth.resetPasswordForEmail(email);

export const verifyResetOTP = (email, token) => 
  supabase.auth.verifyOtp({ email, token, type: 'recovery' });

export const updatePassword = (newPassword) => 
  supabase.auth.updateUser({ password: newPassword });

export const resendOTP = (email, type = 'signup') => 
  supabase.auth.resend({ type, email });