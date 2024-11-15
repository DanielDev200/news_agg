import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordRecovery = async () => {
      const { data: { session }, error } = await supabase.auth.getSessionFromUrl();

      if (error) {
        setMessage('Invalid or expired reset token. Please try again.');
        return;
      }

      if (session) {
        // If there is a session, let the user enter a new password
        setMessage('Please enter your new password.');
      }
    };

    handlePasswordRecovery();
  }, []);

  const handlePasswordChange = async () => {
    if (!password) {
      setMessage('Please enter a new password.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage('Failed to reset password. Please try again.');
      } else {
        setMessage('Password reset successfully. You will be redirected to login.');
        setTimeout(() => navigate('/signin'), 3000);
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '10px', fontSize: '16px' }}
      />
      <br />
      <button onClick={handlePasswordChange} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Update Password
      </button>
      <p>{message}</p>
    </div>
  );
}
