import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContentItem, User } from '../types';
import { getStoredContent } from '../services/store';
import ReactionSystem from '../components/ReactionSystem';
import CommentSection from '../components/CommentSection';

interface ContentDetailProps {
  user: User | null;
  onRequestLogin: () => void;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ user, onRequestLogin }) => {
  const { id } = useParams();
  const content = getStoredContent();
  const item = content.find(c => c.id === id) as ContentItem | undefined;

  useEffect(() => {
    if (item) {
      document.title = `${item.title} | GeekNews`;
      const meta = document.querySelector('meta[name="description"]');
      const text = item.description.substring(0, 160);
      if (meta) meta.setAttribute('content', text);
      else {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        m.setAttribute('content', text);
        document.head.appendChild(m);
      }
    }
  }, [item]);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-gray-400">Conteúdo não encontrado.</p>
        <Link to="/" className="text-geek-primary">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-geek-card border border-gray-700 rounded-xl overflow-hidden">
        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
        <div className="p-6">
          <div className="flex gap-2 mb-3">
            {item.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase font-bold text-geek-primary bg-geek-primary/10 px-2 py-0.5 rounded border border-geek-primary/20">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">{item.title}</h1>
          {item.category === 'VIDEO' && item.videoUrl ? (
            <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-black">
              <iframe width="100%" height="100%" src={item.videoUrl} title={item.title} frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : null}
          <div className="prose prose-invert">
            {item.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4 border-t border-gray-700/50 pt-2">
            <span>Por {item.author}</span>
            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
          </div>
          <ReactionSystem contentId={item.id} canReact={!!user} onRequestLogin={onRequestLogin} username={user?.username} />
          <div className="mt-6">
            <CommentSection contentId={item.id} user={user} onRequestLogin={onRequestLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;