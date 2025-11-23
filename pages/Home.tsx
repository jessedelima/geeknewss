import React from 'react';
import { ContentItem, User } from '../types';
import ContentCard from '../components/ContentCard';
import { Zap } from 'lucide-react';

interface HomeProps {
  content: ContentItem[];
  user: User | null;
  onRequestLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ content, user, onRequestLogin }) => {
  // Sort by newest
  const sortedContent = [...content].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Mundo <span className="text-transparent bg-clip-text bg-gradient-to-r from-geek-primary to-geek-accent">Geek</span> Sem Limites
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          As últimas novidades, gameplays insanos e discussões acaloradas. Entre, reaja e comente!
        </p>
      </div>

      {/* Latest Feed */}
      <div className="flex items-center gap-2 mb-6">
        <Zap className="text-yellow-400" fill="currentColor" />
        <h2 className="text-2xl font-bold text-white">Destaques do Feed</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedContent.map(item => (
          <ContentCard 
            key={item.id} 
            item={item} 
            user={user} 
            onRequestLogin={onRequestLogin} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;