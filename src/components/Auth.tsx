
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const AuthBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://auth.util.repl.co/script.js';
    script.setAttribute('data-replit-user-id', 'true');
    
    const handleAuth = (e: MessageEvent) => {
      if (e.data?.type === 'authed') {
        fetch('/__replauthuser')
          .then(response => response.json())
          .then(user => {
            if (user?.id) {
              navigate('/dashboard');
            }
          });
      }
    };

    window.addEventListener('message', handleAuth);
    document.body.appendChild(script);

    return () => {
      window.removeEventListener('message', handleAuth);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [navigate]);

  return (
    <Container>
      <AuthBox>
        <h1>Welcome to Bookmark Manager</h1>
        <div id="replit-auth-button" />
      </AuthBox>
    </Container>
  );
};

export default Auth;
