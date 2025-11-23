import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}