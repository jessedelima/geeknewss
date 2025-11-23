import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, role: UserRole) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    // Simple mock auth logic
    if (username === 'admin' && password === 'admin') {
      onLogin('Admin', UserRole.ADMIN);
    } else {
      // Any other login is a regular user
      onLogin(username, UserRole.USER);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-geek-card border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Entrar no <span className="text-geek-primary">GeekNews</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-geek-primary outline-none"
              placeholder="Ex: admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-geek-primary outline-none"
              placeholder="Ex: admin (para admin) ou qualquer coisa"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-geek-primary hover:bg-violet-700 text-white font-bold py-2 rounded-lg transition mt-2"
          >
            Entrar
          </button>
        </form>
        
        <p className="text-gray-500 text-xs mt-4 text-center">
          Dica: Use <strong>admin/admin</strong> para acessar o painel de administrador.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;