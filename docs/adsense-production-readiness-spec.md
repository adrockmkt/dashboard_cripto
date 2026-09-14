# Especificação de prontidão para AdSense

Data: 14 de setembro de 2026  
Produto: Cripto Dashboard, da Ad Rock Digital Mkt

## Objetivo

Preparar o produto público para uma solicitação responsável ao Google AdSense,
sem colocar anúncios antes da aprovação, sem reduzir a utilidade das ferramentas
e sem apresentar dados de mercado fictícios como se fossem dados reais.

## Resultado de produto

1. Cada ferramenta pública terá uma explicação humana, original e indexável:
   o que resolve, como usar, como interpretar o resultado, limites, risco e
   links para fontes e conteúdos correlatos.
2. O dashboard continuará aberto, sem login, mas telas operacionais não serão
   usadas para exibir anúncios.
3. A experiência em 320, 360, 390, 768, 1024 e 1440 px não terá rolagem
   horizontal, botões cortados nem controles essenciais ocultos.
4. Falhas de fornecedores não exibirão URLs, códigos HTTP ou mensagens técnicas
   ao visitante. Dados indisponíveis serão identificados com clareza, com ação
   de tentar novamente e sem série simulada apresentada como real.
5. Toda ação interativa terá teste automatizado quando puder ser validada em
   JSDOM e evidência manual no navegador para fluxos visuais, downloads,
   permissão de navegador e integrações externas.
6. Nenhum código AdSense será incluído nesta entrega. A integração só começa
   depois de conta aprovada, `ca-pub-...` fornecido pela Ad Rock e revisão de
   consentimento aplicável.

## Evidências de partida

- A captura mobile de On-Chain mostra o aviso interno “Exchange flow...” e
  quatro falhas `Fonte de mercado indisponível (400)`.
- A captura mobile de Alertas mostra o título e os botões “Atualizar” e “Novo
  Alerta” concorrendo pela mesma linha; o CTA é cortado na largura de iPhone.
- `docs/audits/functional-audit-2026-09-12.md` tem a matriz de controles, mas
  quase todos os itens ainda estão pendentes de execução.
- `docs/adsense-readiness.md` precisa trocar a decisão de prontidão somente
  depois dos gates deste documento serem aprovados em produção.

## Decisões obrigatórias

- O aviso de integração incompleta será removido. Não será reescrito como
  marketing nem escondido enquanto os dados falsos permanecerem visíveis.
- Métricas on-chain só serão rotuladas como “Fonte real” quando todos os
  valores exibidos vierem da fonte. Dados parciais usarão “Dados parciais”,
  indicarão quais métricas não estão disponíveis e omitirão os gráficos/valores
  ausentes.
- A opção de fallback será apenas um estado de indisponibilidade; os números
  gerados em `buildFallbackHistory` não serão apresentados ao visitante.
- Email e webhook continuarão desligados até existir backend autenticado e
  rate-limited. Nenhum webhook de visitante será chamado diretamente pelo
  navegador.
- Espaço de anúncio permanecerá exclusivo de artigos públicos com conteúdo
  substancial e será ativado somente após aprovação.

## Critérios de aceite para a inscrição

- Todas as rotas públicas retornam 200, têm canonical, título, descrição,
  robots `index,follow` quando apropriado e aparecem no sitemap.
- Pelo menos uma página-guia para cada ferramenta priorizada está publicada,
  ligada a partir do dashboard e a partir do hub de ferramentas.
- A matriz funcional não tem itens críticos/altos pendentes; controles externos
  são verificados sem disparar mensagem, e-mail ou webhook reais.
- A inspeção mobile em navegadores reais cobre Safari iOS e Chrome Android;
  não há clipping de CTA, sobreposição com a barra inferior ou rolagem
  horizontal.
- GA4 funciona apenas após consentimento, e os eventos de navegação de guia e
  abertura da ferramenta aparecem no DebugView.
- O Search Console recebeu o sitemap e o domínio canônico escolhido; caso o
  novo domínio seja comprado, a migração e os redirecionamentos 301 ocorrem
  antes do pedido ao AdSense.
