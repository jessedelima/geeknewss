# GeekNews

Aplicação de notícias e vídeos com comentários e reações.

## Rodar localmente

- Pré-requisitos: Node.js
- Instalar dependências: `npm install`
- Iniciar em desenvolvimento: `npm run dev`
- Build de produção: `npm run build`
- Preview do build: `npm run preview`

## Funcionalidades

- Feed com destaques, ordenado por mais recente
- Aba "Notícias" com grid responsivo de cards
- Aba "Vídeos" com embed e visualização direta
- Reações: curtir, não curtir, alegre e bravo, com contagem
- Comentários por conteúdo (apenas usuários logados podem comentar)
- Autenticação simples com papel de usuário e administrador
- Painel do Administrador para publicar notícias e vídeos
- Persistência em `localStorage` (sem backend)

## Melhorias planejadas

 - ✔️ Estilos base e tema (CSS utilitário) para padronizar visual
 - ✔️ Página de detalhe do conteúdo (rota por `id`) com SEO básico
 - ✔️ Persistência da sessão de usuário (login lembrado)
 - ✔️ Limitação de uma reação por usuário com opção de trocar
 - ✔️ Moderação e validação de comentários (anti-spam)
 - ✔️ Remoção do polling (evento de atualização)
 - Busca e filtros por categoria/tags; páginas de tag
 - Paginação/Infinite Scroll no feed
 - Store global (Context/Reducer)
 - Backend/API para conteúdo e usuários; integração com banco
 - Testes unitários e pipeline de CI com GitHub Actions
 - Deploy (GitHub Pages/Vercel) com otimizações de performance

## Próximos passos

- Busca e filtros por tags/categorias.
- Paginação/Infinite Scroll.
- Store global para conteúdo e UI além do evento (opcional).
- Backend/API, testes e pipeline CI, otimizações de deploy.
