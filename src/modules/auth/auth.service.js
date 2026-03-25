import { supabase } from '../../config/supabase.js';

export const signUpWithEmail = (email, password) => supabase.auth.signUp({ email, password });
export const signInWithEmail = (email, password) => supabase.auth.signInWithPassword({ email, password });
export const sendOTP = (email) => supabase.auth.signInWithOtp({ email });
export const verifyOTP = (email, token) => supabase.auth.verifyOtp({ email, token, type: 'signup' });
export const signOut = () => supabase.auth.signOut();