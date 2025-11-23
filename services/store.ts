import { ContentItem, Comment, ReactionCounts, ReactionType, User, UserRole } from '../types';

// Mock Initial Data
const INITIAL_NEWS: ContentItem[] = [
  {
    id: '1',
    title: 'Nova temporada de Arcane confirmada!',
    description: 'A Netflix confirmou hoje que a segunda temporada de Arcane está em produção acelerada. Os fãs de League of Legends podem esperar mais profundidade na história de Vi e Jinx. A animação promete manter o nível de qualidade visual que chocou o mundo.',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    category: 'NEWS',
    timestamp: Date.now() - 100000,
    author: 'Admin',
    tags: ['LoL', 'Netflix', 'Arcane']
  },
  {
    id: '2',
    title: 'Review: O novo processador quântico',
    description: 'Testamos o novo chip que promete revolucionar o gaming. Será que roda Crysis? A resposta pode te surpreender. A arquitetura baseada em qubits instáveis traz desafios térmicos, mas o desempenho em ray tracing é absurdo.',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    category: 'NEWS',
    timestamp: Date.now() - 200000,
    author: 'Admin',
    tags: ['Hardware', 'Tech', 'Quantum']
  }
];

const INITIAL_VIDEOS: ContentItem[] = [
  {
    id: '3',
    title: 'Gameplay Exclusivo: GTA VI',
    description: 'Análise frame a frame do trailer vazado. O que podemos esperar da física de água e dos NPCs? Nossos especialistas discutem tudo neste vídeo.',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    category: 'VIDEO',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Rick Roll placeholder acting as a generic video
    timestamp: Date.now(),
    author: 'Admin',
    tags: ['GTA', 'Rockstar', 'Games']
  }
];

// Local Storage Keys
const KEYS = {
  CONTENT: 'geeknews_content',
  COMMENTS: 'geeknews_comments',
  REACTIONS: 'geeknews_reactions',
  USER_REACTIONS: 'geeknews_user_reactions',
  COMMENT_LAST: 'geeknews_comment_last'
};

// Helpers
export const getStoredContent = (): ContentItem[] => {
  const stored = localStorage.getItem(KEYS.CONTENT);
  if (!stored) {
    // Initialize with mock data
    const initial = [...INITIAL_NEWS, ...INITIAL_VIDEOS];
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const addContent = (item: ContentItem) => {
  const current = getStoredContent();
  const updated = [item, ...current];
  localStorage.setItem(KEYS.CONTENT, JSON.stringify(updated));
  try { window.dispatchEvent(new CustomEvent('geeknews:contentUpdated')); } catch {}
};

export const getComments = (contentId: string): Comment[] => {
  const stored = localStorage.getItem(KEYS.COMMENTS);
  const allComments: Record<string, Comment[]> = stored ? JSON.parse(stored) : {};
  return allComments[contentId] || [];
};

export const addComment = (contentId: string, comment: Comment) => {
  const stored = localStorage.getItem(KEYS.COMMENTS);
  const allComments: Record<string, Comment[]> = stored ? JSON.parse(stored) : {};
  
  if (!allComments[contentId]) {
    allComments[contentId] = [];
  }
  allComments[contentId].unshift(comment);
  localStorage.setItem(KEYS.COMMENTS, JSON.stringify(allComments));
  const lastKey = `${contentId}:${comment.author}`;
  const lastStore = localStorage.getItem(KEYS.COMMENT_LAST);
  const map: Record<string, number> = lastStore ? JSON.parse(lastStore) : {};
  map[lastKey] = comment.timestamp;
  localStorage.setItem(KEYS.COMMENT_LAST, JSON.stringify(map));
};

export const getReactions = (contentId: string): ReactionCounts => {
  const stored = localStorage.getItem(KEYS.REACTIONS);
  const allReactions: Record<string, ReactionCounts> = stored ? JSON.parse(stored) : {};
  return allReactions[contentId] || { LIKE: 0, DISLIKE: 0, HAPPY: 0, ANGRY: 0 };
};

export const addReaction = (contentId: string, type: ReactionType) => {
  const stored = localStorage.getItem(KEYS.REACTIONS);
  const allReactions: Record<string, ReactionCounts> = stored ? JSON.parse(stored) : {};
  
  if (!allReactions[contentId]) {
    allReactions[contentId] = { LIKE: 0, DISLIKE: 0, HAPPY: 0, ANGRY: 0 };
  }
  
  allReactions[contentId][type]++;
  localStorage.setItem(KEYS.REACTIONS, JSON.stringify(allReactions));
  return allReactions[contentId];
};

export const getUserReaction = (contentId: string, username: string): ReactionType | null => {
  const stored = localStorage.getItem(KEYS.USER_REACTIONS);
  const map: Record<string, Record<string, ReactionType>> = stored ? JSON.parse(stored) : {};
  const userMap = map[contentId] || {};
  return userMap[username] || null;
};

export const setUserReaction = (contentId: string, username: string, type: ReactionType): ReactionCounts => {
  const storedReacts = localStorage.getItem(KEYS.REACTIONS);
  const allReactions: Record<string, ReactionCounts> = storedReacts ? JSON.parse(storedReacts) : {};
  if (!allReactions[contentId]) {
    allReactions[contentId] = { LIKE: 0, DISLIKE: 0, HAPPY: 0, ANGRY: 0 };
  }
  const storedMap = localStorage.getItem(KEYS.USER_REACTIONS);
  const map: Record<string, Record<string, ReactionType>> = storedMap ? JSON.parse(storedMap) : {};
  if (!map[contentId]) map[contentId] = {};
  const prev = map[contentId][username] || null;
  if (prev && prev !== type) {
    const prevCount = allReactions[contentId][prev];
    allReactions[contentId][prev] = Math.max(0, prevCount - 1);
  }
  if (!prev || prev !== type) {
    allReactions[contentId][type]++;
    map[contentId][username] = type;
  }
  localStorage.setItem(KEYS.REACTIONS, JSON.stringify(allReactions));
  localStorage.setItem(KEYS.USER_REACTIONS, JSON.stringify(map));
  return allReactions[contentId];
};

export const canUserComment = (contentId: string, username: string, text: string): { ok: boolean; reason?: string } => {
  const t = text.trim();
  if (t.length < 3) return { ok: false, reason: 'Comentário muito curto.' };
  if (t.length > 300) return { ok: false, reason: 'Comentário muito longo.' };
  if (/(https?:\/\/|www\.)/i.test(t)) return { ok: false, reason: 'Links não são permitidos.' };
  const lastStore = localStorage.getItem(KEYS.COMMENT_LAST);
  const map: Record<string, number> = lastStore ? JSON.parse(lastStore) : {};
  const lastKey = `${contentId}:${username}`;
  const last = map[lastKey] || 0;
  if (Date.now() - last < 15000) return { ok: false, reason: 'Aguarde antes de comentar novamente.' };
  return { ok: true };
};
