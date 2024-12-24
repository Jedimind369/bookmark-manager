
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const AuthBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://auth.util.repl.co/script.js';
    script.setAttribute('data-replit-user-id', 'true');
    
    script.onload = () => {
      window.addEventListener('message', (e) => {
        if (e.data?.type === 'authed') {
          navigate('/dashboard');
          window.location.reload();
        }
      });
    };
    
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  return (
    <AuthContainer>
      <AuthBox>
        <h1>Welcome</h1>
        <p>Please sign in to continue</p>
        <div id="replit-auth-button" />
      </AuthBox>
    </AuthContainer>
  );
};

export default Auth;
