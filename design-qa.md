# Design QA — Redesign Ad Rock

## Alvos de comparação

- **Fonte visual:** `/Users/rafaellins/.codex/generated_images/01a087d6-4114-7d80-948e-4461d6000ae4/exec-8fb65599-b32b-472e-ac2c-c8fbf394c99e.png`.
- **Implementação:** Cripto Dashboard local em `http://127.0.0.1:4173/`, captura pelo Codex In-app Browser, aba 1.
- **Captura desktop:** 1440 × 1024 CSS px, densidade 1x, dashboard e Trading Pro.
- **Captura mobile:** 390 × 844 CSS px, densidade 1x, dashboard e menu lateral.
- **Normalização:** a referência é uma proposta ilustrativa 1440 × 1024; a comparação usa a mesma largura de desktop e a área de conteúdo do app, sem chrome do navegador.

As capturas de implementação foram revisadas diretamente no In-app Browser durante esta sessão; o navegador não persiste automaticamente os PNGs em um caminho do workspace.

## Evidências de interação

- Desktop: sidebar, item ativo, logo original, busca, atualização, notificações, idioma/tema e Trading Pro exibidos.
- Mobile: navegação inferior, header, menu lateral, preferências e Trading Pro verificados.
- Controles testados: abrir menu, navegar para Trading Pro, abrir o painel de indicadores, atualizar o gráfico e fechar/pular o onboarding.
- Console: não houve novo aviso de título/descrição de diálogo após a correção. O ambiente Vite local retorna 404 para rotas de gateway de mercado porque o proxy Nginx de produção não existe localmente; os componentes exibem dados alternativos. Isso não altera a composição visual e requer conferência final na URL publicada.

## Verificação publicada

- Publicação realizada em `/home/adrock/cripto-dashboard/` via SSH em 13 de setembro de 2026.
- `https://mobiledelivery.com.br/cripto-dashboard/` respondeu `200 OK` após a cópia, com `Last-Modified` correspondente ao deploy.
- O In-app Browser carregou a página publicada, exibiu o novo briefing e retornou sentimento/dominância de mercado. Nenhum erro novo da interface foi adicionado ao console após abrir a URL publicada.

## Otimização posterior de carregamento

- Medição anterior: `Index` com 1.160,49 kB / 353,99 kB gzip.
- Medição após lazy loading de Trading Pro, On-chain, modelos, alertas e indicadores: `Index` com 552,36 kB / 175,65 kB gzip.
- Redução do JavaScript inicial: aproximadamente 50% em gzip. Os módulos adiados são baixados somente ao abrir sua respectiva aba.

## Avaliação das superfícies de fidelidade

### Tipografia e copy

**Resultado:** aprovado. Títulos ganham peso e hierarquia editorial; `Visão de mercado`, `Trading Pro` e `BTC / BRL` são claros. O texto de risco continua visível. A fonte permanece a pilha do projeto, em vez de introduzir download de fonte.

### Espaçamento e layout

**Resultado:** aprovado. Desktop usa barra lateral fixa, área central mais ampla e cartões com ritmo consistente. Em 390 px, briefing e cards passam para coluna sem rolagem horizontal; a navegação inferior respeita a área inferior. O menu mobile concentra preferências sem congestionamento do cabeçalho.

### Cores e tokens

**Resultado:** aprovado. Fundo grafite/preto, CTA e estado ativo em laranja de chama, acentos em vermelho/âmbar e texto prata derivam da logo. Verde e vermelho continuam semânticos para dados financeiros. O gráfico usa cinzas quentes e verde/vermelho legíveis, com azul ausente como cor de marca.

### Imagens e ativos

**Resultado:** aprovado. A logo de produção é a asset original da Ad Rock. A arte/personagem criada para a referência não foi colocada no bundle, por não ser ativo de marca e por custo de desempenho. Essa é uma divergência intencional: o briefing usa composição editorial sem imagem pesada.

### Responsividade, acessibilidade e estados

**Resultado:** aprovado. O destino selecionado não depende somente de ícone, botões críticos têm nome acessível, o diálogo mobile tem título/descrição, e o onboarding é complementar e não modal. Foram executados menu, navegação Trading, atualização e painel de indicadores.

## Findings

- [P3] O chunk principal ainda tem aproximadamente 552 kB minificado. Impacto: pode limitar o desempenho mobile descrito no PageSpeed em conexões lentas. Uma iteração posterior pode separar bibliotecas compartilhadas de gráficos e exportação.
- [P3] O agrupamento “Mais” na navegação inferior ainda não foi criado. Os destinos permanecem acessíveis pelo menu lateral.

## Histórico de iteração

1. A primeira captura mobile exibiu onboarding modal cobrindo a primeira dobra; foi substituído por introdução complementar não bloqueante.
2. O console sinalizou que o painel lateral não possuía `DialogTitle`; título e descrição acessíveis foram adicionados e cobertos por `Index.test.tsx`.
3. Capturas desktop/mobile posteriores confirmaram logo, paleta, contexto de Trading e menu de preferências.

## Resultado

final result: passed
