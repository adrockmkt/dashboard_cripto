# Redesign de Marca Ad Rock — Especificação

## Objetivo

Reformular a experiência visual do Cripto Dashboard para que a marca Ad Rock seja reconhecível em toda a interface pública, mantendo todas as ferramentas, rotas, conteúdos, integrações e rastreamento atuais funcionando sem login.

## Fonte visual aprovada

- Logo de produção: `src/assets/adrock-logo.png`.
- Referência aprovada: `/Users/rafaellins/.codex/generated_images/01a087d6-4114-7d80-948e-4461d6000ae4/exec-8fb65599-b32b-472e-ac2c-c8fbf394c99e.png`.
- A referência define composição e paleta; a aplicação não reutilizará personagens, ilustrações, logotipos ou textos gerados que não pertençam à Ad Rock.

## Direção visual

### Sistema de cor

O tema padrão será escuro e orientado pela marca:

- superfícies base em preto e grafite;
- cor de ação principal em laranja de chama;
- vermelho como destaque de marca, alertas negativos e áreas editoriais pontuais;
- âmbar para ênfase, foco e estados de atenção;
- prata/branco quente para tipografia e ícones;
- azul aço exclusivamente como série auxiliar de gráficos, nunca como a cor de marca ou CTA.

As variáveis semânticas de `src/index.css` serão a única fonte de cor para componentes shadcn e CSS de layout. Estados financeiros permanecem semânticos: verde para alta/positivo, vermelho para baixa/negativo e âmbar para aviso.

### Tipografia e forma

A tipografia seguirá a pilha local já usada pelo projeto, com títulos de painel de peso alto, números financeiros tabulares quando disponíveis e texto auxiliar de contraste suficiente. Os cartões terão superfícies quase pretas, borda discreta, raio médio e sombra curta; brilhos devem ser mínimos para não prejudicar leitura ou desempenho. Não serão usadas imagens de IA na interface de produção para substituir ícones, dados ou controles.

## Arquitetura de experiência

### Estrutura desktop

1. A barra lateral mantém todos os destinos existentes, exibe a logo Ad Rock no topo e usa o laranja para o item ativo. O recolhimento continua acessível por rótulo ARIA.
2. O cabeçalho concentra menu, busca, atualização e notificações; ações secundárias não competem com o conteúdo de mercado.
3. A aba inicial abre com o briefing de mercado e seus indicadores antes de painéis secundários. Cards, tabelas e gráficos ganham a nova hierarquia visual sem mudança no contrato de dados.
4. Trading Pro mantém par, período, gráfico e fontes atuais, mas recebe uma barra de contexto visual consistente e controles agrupados.

### Estrutura mobile

1. Cabeçalho compacto contém apenas navegação, busca e notificações/atualização essenciais.
2. A barra inferior mantém acesso rápido aos destinos centrais e continua respeitando a área segura do aparelho.
3. Grades viram uma coluna sem ocultar indicadores, tabelas ou CTA principal. Controles de trading continuam disponíveis pelo painel móvel existente.
4. A logo não é sacrificada: aparece em formato adequado ao cabeçalho ou à navegação, sem reduzir a área útil de dados.

## Escopo técnico

Serão atualizados `src/index.css`, `src/pages/Index.tsx`, `src/components/Sidebar.tsx`, `src/components/MobileBottomNav.tsx` e os componentes de dashboard diretamente afetados pelo shell e pelos cartões. Os componentes shadcn existentes serão reaproveitados; não haverá migração para MUI nem dependência de biblioteca visual nova.

Rotas públicas, SEO, páginas editoriais, consentimento, GA4, gateway de dados e placeholders de AdSense não devem sofrer mudança funcional. A interface deve continuar aberta, sem autenticação e sem coleta de informação financeira do visitante.

## Acessibilidade e desempenho

- Contraste mínimo WCAG AA em textos, estados ativos e foco visível.
- Todo botão com ícone mantém nome acessível.
- Movimento decorativo respeita `prefers-reduced-motion`.
- Não haverá hero de imagem pesado, vídeo, fonte remota ou arte gerada adicionada ao bundle.
- O layout não poderá produzir rolagem horizontal em 360 px de largura.

## Validação

1. Testes unitários e de componentes existentes continuam passando; novos comportamentos de navegação recebem testes pontuais.
2. `npm run lint` e `npm run build` executam sem erros.
3. A aplicação será capturada em desktop e em mobile, com a aba inicial e Trading Pro, e comparada à referência aprovada.
4. O relatório `design-qa.md` registrará a comparação, correções e resultado final `passed` ou `blocked`.
5. Após validação local, as mudanças serão documentadas, commitadas, enviadas ao repositório e publicadas no ambiente já autorizado pelo usuário.
