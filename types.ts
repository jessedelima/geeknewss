export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface User {
  username: string;
  role: UserRole;
  avatar?: string;
}

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  HAPPY = 'HAPPY',
  ANGRY = 'ANGRY'
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string; // For articles, this is the body. For videos, a summary.
  imageUrl: string;
  category: 'NEWS' | 'VIDEO';
  videoUrl?: string; // Only for videos
  timestamp: number;
  author: string;
  tags: string[];
}

export interface ReactionCounts {
  [ReactionType.LIKE]: number;
  [ReactionType.DISLIKE]: number;
  [ReactionType.HAPPY]: number;
  [ReactionType.ANGRY]: number;
}

// Helper for UI display
export const REACTION_ICONS = {
  [ReactionType.LIKE]: '👍',
  [ReactionType.DISLIKE]: '👎',
  [ReactionType.HAPPY]: '😄',
  [ReactionType.ANGRY]: '😡',
};