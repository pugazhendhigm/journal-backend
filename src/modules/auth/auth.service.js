import { supabase, supabaseAdmin } from '../../config/supabase.js';

const EMAIL_RATE_LIMIT_MESSAGE = 'Verification OTP already sent recently. Please check your inbox or wait a bit before requesting another code.';
const DEV_BYPASS_MESSAGE = 'Development mode: email OTP was skipped because the auth email rate limit was reached. You can log in with this account now.';
const isDevelopment = process.env.NODE_ENV === 'development';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const isEmailRateLimitError = (error) =>
  error?.status === 429 && error?.message?.toLowerCase().includes('email rate limit exceeded');

const findAuthUserByEmail = async (email) => {
  if (!supabaseAdmin?.auth?.admin?.listUsers) {
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;

  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
};

const createOrConfirmUserForDevelopment = async (email, password, existingUser = null) => {
  if (!isDevelopment || !supabaseAdmin?.auth?.admin) {
    return null;
  }

  if (existingUser) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;

    return {
      user: data.user,
      message: DEV_BYPASS_MESSAGE,
      pendingVerification: false,
    };
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;

  return {
    user: data.user,
    message: DEV_BYPASS_MESSAGE,
    pendingVerification: false,
  };
};

export const signUp = async (email, password) => {
  const existingUser = await findAuthUserByEmail(email);

  if (existingUser?.email_confirmed_at) {
    throw createError('Account already exists. Please log in.', 409);
  }

  if (existingUser) {
    const developmentUser = await createOrConfirmUserForDevelopment(email, password, existingUser);
    if (developmentUser) {
      return developmentUser;
    }

    return {
      user: existingUser,
      message: EMAIL_RATE_LIMIT_MESSAGE,
      pendingVerification: true,
    };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error && isEmailRateLimitError(error)) {
    const throttledUser = await findAuthUserByEmail(email);

    if (throttledUser && !throttledUser.email_confirmed_at) {
      const developmentUser = await createOrConfirmUserForDevelopment(email, password, throttledUser);
      if (developmentUser) {
        return developmentUser;
      }

      return {
        user: throttledUser,
        message: EMAIL_RATE_LIMIT_MESSAGE,
        pendingVerification: true,
      };
    }

    const developmentUser = await createOrConfirmUserForDevelopment(email, password);
    if (developmentUser) {
      return developmentUser;
    }
  }

  if (error) throw error;

  return {
    user: data.user,
    message: 'Verification OTP sent to email',
    pendingVerification: false,
  };
};

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
