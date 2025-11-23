import React, { useState, useEffect } from 'react';
import { Comment, User } from '../types';
import { getComments, addComment, canUserComment } from '../services/store';
import { MessageSquare, Send } from 'lucide-react';

interface CommentSectionProps {
  contentId: string;
  user: User | null;
  onRequestLogin: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ contentId, user, onRequestLogin }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setComments(getComments(contentId));
  }, [contentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequestLogin();
      return;
    }
    setError('');
    const check = canUserComment(contentId, user.username, newComment);
    if (!check.ok) { setError(check.reason || 'Inválido'); return; }

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: user.username,
      timestamp: Date.now()
    };

    addComment(contentId, comment);
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  return (
    <div className="mt-8 border-t border-gray-800 pt-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <MessageSquare size={20} className="text-geek-primary" />
        Comentários ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Escreva seu comentário..." : "Faça login para comentar"}
            disabled={!user}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-geek-primary outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!user || !newComment.trim()}
            className="bg-geek-primary disabled:bg-gray-700 text-white p-2 rounded-lg hover:bg-violet-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm italic">Seja o primeiro a comentar!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-geek-secondary text-sm">{comment.author}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;