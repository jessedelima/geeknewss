import React, { useState } from 'react';
import { ContentItem } from '../types';
import { addContent } from '../services/store';
import { generateGeekContent, generateTags } from '../services/geminiService';
import { PenTool, Video, Sparkles, Save, Loader2 } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NEWS' | 'VIDEO'>('NEWS');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // AI Generation Handler
  const handleAIGenerate = async () => {
    if (!title) return;
    setIsGenerating(true);
    const generatedText = await generateGeekContent(title);
    setDescription(generatedText);
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto generate tags
    const tags = await generateTags(description);

    const newItem: ContentItem = {
      id: Date.now().toString(),
      title,
      description,
      imageUrl: imageUrl || `https://picsum.photos/800/400?random=${Date.now()}`,
      category: activeTab,
      videoUrl: activeTab === 'VIDEO' ? videoUrl : undefined,
      timestamp: Date.now(),
      author: 'Admin',
      tags
    };

    addContent(newItem);
    setSuccessMsg('Conteúdo publicado com sucesso!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setVideoUrl('');
    
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">Painel do Administrador</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('NEWS')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition
            ${activeTab === 'NEWS' ? 'bg-geek-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
          `}
        >
          <PenTool size={20} />
          Postar Notícia
        </button>
        <button 
          onClick={() => setActiveTab('VIDEO')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition
            ${activeTab === 'VIDEO' ? 'bg-geek-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
          `}
        >
          <Video size={20} />
          Postar Vídeo
        </button>
      </div>

      <div className="bg-geek-card border border-gray-700 rounded-xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-geek-primary outline-none"
                placeholder="Ex: O fim dos consoles?"
                required
              />
              {activeTab === 'NEWS' && (
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={!title || isGenerating}
                  className="bg-geek-secondary/20 text-geek-secondary border border-geek-secondary hover:bg-geek-secondary/30 px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                  title="Gerar texto com IA"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  <span className="hidden sm:inline">Gerar c/ IA</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {activeTab === 'NEWS' ? 'Corpo da Notícia (Markdown)' : 'Descrição do Vídeo'}
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-geek-primary outline-none font-mono text-sm"
              placeholder="Escreva aqui..."
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL da Imagem (Capa)</label>
              <input 
                type="url" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-geek-primary outline-none"
                placeholder="Deixe vazio para aleatória"
              />
            </div>
            
            {activeTab === 'VIDEO' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL do Embed (YouTube)</label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-geek-primary outline-none"
                  placeholder="Ex: https://www.youtube.com/embed/..."
                  required={activeTab === 'VIDEO'}
                />
              </div>
            )}
          </div>

          {successMsg && (
            <div className="bg-green-900/30 text-green-400 p-3 rounded-lg border border-green-800 text-center font-medium animate-pulse">
              {successMsg}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-geek-primary hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20"
          >
            <Save size={20} />
            Publicar Conteúdo
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;