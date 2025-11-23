import React from 'react';
import { ContentItem, User } from '../types';
import ReactionSystem from './ReactionSystem';
import CommentSection from './CommentSection';
import { PlayCircle } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  user: User | null;
  onRequestLogin: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, user, onRequestLogin }) => {
  return (
    <div className="bg-geek-card/90 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden hover:border-geek-primary/50 transition duration-300 shadow-xl hover:shadow-2xl hover:shadow-geek-primary/10">
      <div className="relative group">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-48 object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-geek-card/90 via-transparent to-transparent opacity-60"></div>
        {item.category === 'VIDEO' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
            <PlayCircle size={48} className="text-white drop-shadow-lg scale-100 group-hover:scale-110 transition" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-bold uppercase tracking-wider border border-white/10">
          {item.category === 'NEWS' ? 'Notícia' : 'Vídeo'}
        </div>
      </div>

      <div className="p-5">
        <div className="flex gap-2 mb-2">
            {item.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase font-bold text-geek-primary bg-geek-primary/10 px-2 py-0.5 rounded border border-geek-primary/20">
                    {tag}
                </span>
            ))}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
        
        {item.category === 'VIDEO' && item.videoUrl ? (
            <div className="mb-4 mt-2 aspect-video rounded-lg overflow-hidden bg-black shadow-inner">
                {/* Simple embed simulation */}
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={item.videoUrl} 
                    title={item.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        ) : null}

        <div className="text-gray-300 text-sm line-clamp-3 mb-4 prose prose-invert prose-sm max-w-none">
            {/* Very basic markdown render simulation for description */}
            {item.description.split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
            ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 border-b border-gray-700/50 pb-2">
          <span>Por {item.author}</span>
          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
        </div>

        <ReactionSystem 
          contentId={item.id} 
          canReact={!!user} 
          onRequestLogin={onRequestLogin} 
        />
        
        <div className="mt-4">
            <details className="group">
                <summary className="list-none cursor-pointer text-sm text-geek-primary hover:text-geek-accent transition flex items-center gap-2 font-medium">
                    <span>Ver Comentários</span>
                </summary>
                <CommentSection 
                    contentId={item.id} 
                    user={user} 
                    onRequestLogin={onRequestLogin} 
                />
            </details>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;