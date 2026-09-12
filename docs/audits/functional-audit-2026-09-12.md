# Auditoria funcional pública — 12 de setembro de 2026

**URL:** `https://mobiledelivery.com.br/cripto-dashboard/`  
**Escopo:** funcionalidades abertas, sem login e sem dados pessoais.  
**Status geral:** em preparação.

## Método

- Desktop: 1440 × 900; mobile: 390 × 844; sessão limpa em cada perfil.
- Cada linha só poderá ser aprovada com uma evidência observável: mudança de
  tela/estado/URL, download, mensagem ou destino de link.
- Ações irreversíveis ou externas (webhook, e-mail, WhatsApp, notificação e
  exclusão) serão inspecionadas sem disparar uma ação real.

## Matriz de controles

| ID | Tela/viewport | Controle | Ação | Resultado esperado | Resultado observado | Evidência | Status | Gravidade | Decisão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NAV-01 | desktop | Sidebar: recolher/expandir | clique | largura e rótulos alternam | pendente | - | pendente | - | - |
| NAV-02 | desktop | Sidebar: Dashboard | clique | abre panorama | pendente | - | pendente | - | - |
| NAV-03 | desktop | Sidebar: Trading | clique | abre Trading | pendente | - | pendente | - | - |
| NAV-04 | desktop | Sidebar: On-chain | clique | abre On-chain | pendente | - | pendente | - | - |
| NAV-05 | desktop | Sidebar: Modelos | clique | abre modelos | pendente | - | pendente | - | - |
| NAV-06 | desktop | Sidebar: Portfolio | clique | abre portfolio | pendente | - | pendente | - | - |
| NAV-07 | desktop | Sidebar: Charts | clique | abre charts | pendente | - | pendente | - | - |
| NAV-08 | desktop | Sidebar: Relatório | clique | abre relatório | pendente | - | pendente | - | - |
| NAV-09 | desktop | Sidebar: Alertas | clique | abre alertas | pendente | - | pendente | - | - |
| NAV-10 | desktop | Sidebar: Legado | clique | abre visão legado | pendente | - | pendente | - | - |
| NAV-11 | mobile | botão de menu | clique/Escape | abre e fecha Sheet com foco correto | pendente | - | pendente | - | - |
| NAV-12 | mobile | navegação inferior | cada item | abre a aba indicada | pendente | - | pendente | - | - |
| DATA-01 | ambos | atualizar dados | clique | estado de recarga ou erro visível | pendente | - | pendente | - | - |
| DATA-02 | ambos | busca global | abrir, buscar, selecionar | resultado navega para item correto | pendente | - | pendente | - | - |
| DATA-03 | ambos | gráfico candlestick | trocar ativo/timeframe/atualizar | gráfico e rótulos atualizam | pendente | - | pendente | - | - |
| DATA-04 | ambos | indicadores técnicos | tabs e controles | painel correto é mostrado | pendente | - | pendente | - | - |
| DATA-05 | ambos | On-chain | atualizar e tabs | dados/tabs atualizam ou erro é claro | pendente | - | pendente | - | - |
| DATA-06 | ambos | Stock-to-Flow | tabs | histórico, projeções e halvings alternam | pendente | - | pendente | - | - |
| DATA-07 | ambos | Charts avançados | tabs | dominância, altcoins, F&G e técnico alternam | pendente | - | pendente | - | - |
| DATA-08 | ambos | DCA | cenários, tabs, CSV e PDF | simulação/tabs/exportação respondem | pendente | - | pendente | - | - |
| DATA-09 | ambos | relatório diário | carregar dados | relatório ou erro/retry respondem | pendente | - | pendente | - | - |
| UTIL-01 | ambos | tema | abrir menu e selecionar 3 opções | tema persiste e menu fecha | pendente | - | pendente | - | - |
| UTIL-02 | ambos | idioma | abrir menu e selecionar idioma | textos atualizam e menu fecha | pendente | - | pendente | - | - |
| UTIL-03 | ambos | notificações | abrir/fechar/ler/limpar | painel e estados respondem | pendente | - | pendente | - | - |
| UTIL-04 | ambos | favoritos | atualizar/remover | item e estado respondem sem erro | pendente | - | pendente | - | - |
| UTIL-05 | ambos | alertas simples | som/limpar/remover | estado responde sem ação indevida | pendente | - | pendente | - | - |
| UTIL-06 | ambos | alertas avançados | criar/cancelar/tabs/remover | formulário e abas respondem | pendente | - | pendente | - | - |
| UTIL-07 | ambos | alertas personalizados | abrir/criar/cancelar/excluir | estados e validações respondem | pendente | - | pendente | - | - |
| UTIL-08 | ambos | portfolio | holdings/adicionar/remover | formulário e lista respondem | pendente | - | pendente | - | - |
| UTIL-09 | ambos | menu de exportação | CSV/PDF/JSON | menu e formato selecionado respondem | pendente | - | pendente | - | - |
| TRANS-01 | sessão limpa | onboarding | próximo/anterior/pular/fechar | etapas e persistência respondem | pendente | - | pendente | - | - |
| TRANS-02 | sessão limpa | consentimento | aceitar/recusar/reabrir | decisão persiste e banner fecha/reabre | pendente | - | pendente | - | - |
| TRANS-03 | ambos | link de privacidade | clique | abre `/cripto-dashboard/privacidade` | pendente | - | pendente | - | - |
| EXT-01 | ambos | Ad Rock/GitHub/fontes | inspecionar link | URL válida e `noopener` quando externa | pendente | - | pendente | - | - |
| EXT-02 | ambos | e-mail/WhatsApp | inspecionar link | `mailto:` e `wa.me` corretos, sem envio | pendente | - | pendente | - | - |
| A11Y-01 | ambos | teclado | Tab/Shift+Tab/Enter/Espaço/Escape | foco e controle de overlay corretos | pendente | - | pendente | - | - |

## Registro de achados

| ID | Reprodução | Impacto | Prioridade | Decisão |
| --- | --- | --- | --- | --- |
| Nenhum ainda | - | - | - | - |
