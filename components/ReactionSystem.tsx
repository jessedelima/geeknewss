import React, { useState, useEffect } from 'react';
import { ReactionCounts, ReactionType, REACTION_ICONS } from '../types';
import { getReactions, addReaction } from '../services/store';
import { ThumbsUp, ThumbsDown, Smile, Frown } from 'lucide-react';

interface ReactionSystemProps {
  contentId: string;
  canReact: boolean;
  onRequestLogin: () => void;
}

const ReactionSystem: React.FC<ReactionSystemProps> = ({ contentId, canReact, onRequestLogin }) => {
  const [counts, setCounts] = useState<ReactionCounts>({ LIKE: 0, DISLIKE: 0, HAPPY: 0, ANGRY: 0 });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null); // Simple local state tracking per session

  useEffect(() => {
    setCounts(getReactions(contentId));
  }, [contentId]);

  const handleReaction = (type: ReactionType) => {
    if (!canReact) {
      onRequestLogin();
      return;
    }
    
    // In this simple version, users can spam reactions locally for fun, 
    // or we restrict to one per session. Let's allow adding to count.
    const newCounts = addReaction(contentId, type);
    setCounts(newCounts);
    setUserReaction(type);
  };

  const getIcon = (type: ReactionType) => {
    switch(type) {
      case ReactionType.LIKE: return <ThumbsUp size={18} />;
      case ReactionType.DISLIKE: return <ThumbsDown size={18} />;
      case ReactionType.HAPPY: return <Smile size={18} />;
      case ReactionType.ANGRY: return <Frown size={18} />;
      default: return null;
    }
  };

  const getLabel = (type: ReactionType) => {
      switch(type) {
        case ReactionType.LIKE: return "Curti";
        case ReactionType.DISLIKE: return "Não Curti";
        case ReactionType.HAPPY: return "Alegre";
        case ReactionType.ANGRY: return "Bravo";
      }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.values(ReactionType).map((type) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition
            ${userReaction === type ? 'bg-geek-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}
          `}
          title={getLabel(type)}
        >
          {getIcon(type)}
          <span>{counts[type]}</span>
        </button>
      ))}
    </div>
  );
};

export default ReactionSystem;