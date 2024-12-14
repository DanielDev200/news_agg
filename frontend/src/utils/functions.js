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

export const handleEmailLogin = async (email, password, setIsAuthenticated) => {
  if (!email || !password) {
    console.error('Email and password are required.');
    return { success: false, message: 'Email and password are required.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error logging in with email:', error.message);
    return { success: false, message: error.message };
  }

  setIsAuthenticated(true);
  return { success: true, message: 'Logged in successfully.' };
};

export const handleEmailSignup = async (email, password, setIsAuthenticated) => {
  if (!email || !password) {
    console.error('Email and password are required.');
    return { success: false, message: 'Email and password are required.' };
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Error signing up with email:', error.message);
    return { success: false, message: error.message };
  }

  setIsAuthenticated(true);
  return { success: true, message: 'Signed up successfully.' };
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
