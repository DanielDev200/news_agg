import { supabase } from '../supabaseClient';

export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });

  if (error) {
    console.error('Error logging in:', error.message);
  }
};

export const handleEmailLogin = async (email, password) => {
  if (!email || !password) {
    console.error('Email and password are required.');
    return { success: false, message: 'Email and password are required.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error logging in with email:', error.message);
    return { success: false, message: error.message};
  }

  return { success: true, message: 'Logged in successfully.', userId: data.user?.id };
};

export const handleEmailSignup = async (email, password) => {
  if (!email || !password) {
    console.error('Email and password are required.');
    return { success: false, message: 'Email and password are required.' };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Error signing up with email:', error.message);
    return { success: false, message: error.message, userId: data.user?.id };
  }

  return { success: true, message: 'Signed up successfully.', userId: data.user?.id };
};

export const handleLogout = async (setIsAuthenticated) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error logging out:', error.message);
    return { success: false, message: error.message };
  }

  setIsAuthenticated(false);
  return { success: true, message: 'Logged out successfully.' };
};

export const emailRegexTest = (submittedEmail) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const result = emailRegex.test(submittedEmail);
      
  return result
}
