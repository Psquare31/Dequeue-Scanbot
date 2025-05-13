import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="dequeue.jp.auth0.com"
    clientId="I0uR9Io8f88ikFX9dZZabJTZrzw3VGQZ"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>,
  
);
