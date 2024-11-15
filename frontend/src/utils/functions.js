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

export const handleEmailLogin = async () => {
  const email = prompt('Please enter your email:');
  const password = prompt('Please enter your password:');

  if (email && password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Error logging in with email:', error.message);
    }
  }
};

export const handleEmailSignup = async () => {
  const email = prompt('Please enter your email to sign up:');
  const password = prompt('Please enter your password:');

  if (email && password) {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error('Error signing up with email:', error.message);
    }
  }
};

export const handleLogout = async (setIsAuthenticated) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error logging out:', error.message);
    return
  }

  setIsAuthenticated(false);
};
  