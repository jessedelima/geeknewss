import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists, otherwise handle gracefully
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateGeekContent = async (topic: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return "Simulação: API Key não configurada. Este seria um texto gerado por IA sobre " + topic;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Escreva um artigo curto, divertido e engajante (estilo blog geek) sobre o seguinte tópico: "${topic}". Use formatação Markdown. O público alvo são nerds, gamers e fãs de cultura pop.`,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "Não foi possível gerar o conteúdo.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Erro ao conectar com a IA. Tente novamente.";
  }
};

export const generateTags = async (content: string): Promise<string[]> => {
    if (!ai) return ['Geek', 'News'];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Gere 5 tags curtas (uma palavra cada) separadas por vírgula para o seguinte texto: ${content.substring(0, 200)}...`,
        });
        const text = response.text || "";
        return text.split(',').map(s => s.trim());
    } catch (e) {
        return ['Geek', 'Tech'];
    }
}