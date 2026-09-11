# Ferramentas públicas e performance Implementation Design

**Objetivo:** Consolidar o Cripto Dashboard como uma plataforma pública, sem
login, em que cada recurso útil possa ser descoberto, compreendido e aberto
diretamente; preparar a superfície editorial para monetização futura, sem
ativar AdSense antes da revisão de design e de elegibilidade.

## Decisões confirmadas

- Todo recurso útil do produto será utilizável sem login.
- A interface operacional continua sendo o dashboard em
  `/cripto-dashboard/`; não haverá duplicação de calculadoras ou gráficos
  nesta fase.
- As páginas públicas explicam, contextualizam e encaminham para a ferramenta
  correta já aberta.
- A expansão de ferramentas públicas só começa após uma revisão visual do
  produto.
- AdSense é uma possibilidade futura. Não incluir script, conta de publisher,
  anúncios automáticos ou chamadas de anúncio nesta entrega.
- Quando AdSense for habilitado, anúncios só poderão aparecer em conteúdo
  editorial substancial, após o conteúdo principal; não no dashboard, nos
  resultados de ferramenta, em CTAs, gráficos, alertas ou portfolio.

## Inventário atual e destinação pública

| Recurso existente | Destinação | URL pública proposta | Destino operacional |
| --- | --- | --- | --- |
| Simulador DCA | Página própria | `/ferramentas/simulador-dca-bitcoin` | `/cripto-dashboard/?ferramenta=dca` |
| Gráfico candlestick e indicadores | Página própria | `/ferramentas/grafico-bitcoin` | `/cripto-dashboard/?ferramenta=trading` |
| Fear & Greed, dominância e visão de mercado | Página própria | `/ferramentas/indicadores-mercado-cripto` | `/cripto-dashboard/?ferramenta=dashboard` |
| Métricas on-chain | Página própria | `/ferramentas/metricas-on-chain-bitcoin` | `/cripto-dashboard/?ferramenta=onchain` |
| Stock-to-Flow | Página própria | `/ferramentas/modelo-stock-to-flow` | `/cripto-dashboard/?ferramenta=s2f` |
| Alertas de preço e sinais | Página própria | `/ferramentas/alertas-cripto` | `/cripto-dashboard/?ferramenta=alerts` |
| Charts, rankings e comparativos | Página agrupada | `/ferramentas/analise-e-comparacao-cripto` | `/cripto-dashboard/?ferramenta=charts` |
| Relatório diário | Página agrupada | `/ferramentas/relatorio-cripto` | `/cripto-dashboard/?ferramenta=report` |
| Portfolio e favoritos | Explicação institucional, sem indexar dados | `/ferramentas/acompanhamento-de-carteira` | `/cripto-dashboard/?ferramenta=portfolio` |

O item legado não receberá landing page própria. Ele será absorvido pelos
destinos atuais quando suas telas forem consolidadas.

## Arquitetura proposta

### Catálogo único de ferramentas

Um módulo tipado, `src/content/tools.ts`, será a fonte única para título,
slug, descrição, recurso de destino, tópicos relacionados, limites, fontes e
status de indexação. A página índice, as páginas individuais, os metadados,
o sitemap e os CTAs consumirão esse contrato. Assim, nenhuma explicação será
criada como artigo desconectado do produto.

```ts
export interface PublicTool {
  slug: string;
  title: string;
  description: string;
  dashboardTab: DashboardTab;
  searchIntent: string;
  indexable: boolean;
  sections: Array<{ heading: string; body: string }>;
  relatedEditorialSlugs: string[];
  sources: Array<{ label: string; url: string }>;
  riskNotice: boolean;
}

export type DashboardTab =
  | "dashboard"
  | "trading"
  | "onchain"
  | "dca"
  | "s2f"
  | "alerts"
  | "charts"
  | "report"
  | "portfolio";
```

`Index.tsx` deverá ler `ferramenta` na URL somente se o valor pertencer a
`DashboardTab`; valores ausentes ou inválidos mantêm `dashboard`. A troca de
aba pelo usuário sincroniza a URL sem recarregar a página. Isso permite que
uma página pública abra a ferramenta correta, sem autenticação e sem criar
rotas duplicadas para cada aba.

### Superfície pública

As URLs `/ferramentas` e `/ferramentas/:slug` usam `PublicLayout`, `SeoHead`,
metadados canônicos e pré-renderização da infraestrutura já existente. Cada
página terá um único `h1`, explicação de funcionamento, passos de uso,
limitações, fontes, aviso de risco, links para conteúdos relacionados e CTA
"Abrir ferramenta". O sitemap incluirá apenas as páginas com
`indexable: true`; a página de acompanhamento de carteira não expõe dados do
usuário e não cria URL individual de dados pessoais.

### Publicidade futura e consentimento

O componente de área reservada existente poderá ser aplicado apenas abaixo
das seções editoriais. Ele permanecerá um bloco sem rede, sem iframe e sem
script de publicidade. A futura ativação exige uma etapa independente:
aprovação da conta e site pelo AdSense, revisão manual de cada local de
anúncio, atualização da Política de Privacidade e suporte a consentimento de
publicidade separado do consentimento analítico.

## Revisão de design: pré-requisito de execução

Antes de construir as páginas de ferramentas, revisar a experiência atual em
desktop e mobile com os seguintes resultados esperados:

- hierarquia de navegação compreensível entre panorama, análise e modelos;
- sidebar e menu móvel com rótulos, ícones, foco e estados ativos coerentes;
- primeira dobra centrada na ação e no contexto de mercado, sem sobreposição
  visual entre onboarding e consentimento;
- tipografia, espaçamento, contraste e estados de carregamento consistentes
  com a identidade Ad Rock;
- decisão explícita sobre o que deve ser mostrado no dashboard inicial e o
  que pertence às páginas públicas.

O review produz uma lista priorizada de ajustes visuais. Ajustes que mudem a
estrutura da navegação são aplicados antes dos links profundos e das novas
landings, para que a arquitetura pública aponte para uma UX já estabilizada.

## Auditoria funcional obrigatória

Antes da revisão visual, executar uma auditoria de todos os controles
interativos acessíveis sem login. O resultado será uma matriz versionada com:
controle, tela, viewport, ação esperada, resultado observado, evidência,
gravidade e decisão. A matriz cobre desktop e mobile, em sessão nova e sem
dados pessoais.

O escopo mínimo inclui:

- links do cabeçalho, rodapé, sidebar, navegação inferior e páginas públicas;
- botões de troca de aba, abertura de menu, retorno ao dashboard, busca,
  atualização, tema, idioma e notificações;
- onboarding, banner de consentimento, preferências e links de privacidade;
- filtros, timeframes, indicadores, gráficos, simulador DCA, Stock-to-Flow,
  alertas, relatórios, exportações e CTAs de cada ferramenta;
- links externos, e-mail e WhatsApp, verificando URL, `noopener` e destino;
- fluxo por teclado: tabulação, foco visível, Enter, Espaço e Escape em
  dialogs, sheets e menus.

Nenhum botão será marcado como validado apenas por estar renderizado. A
auditoria deve confirmar o efeito observável: alteração correta de tela,
estado, URL, download, mensagem de erro ou ação externa. Controles que sejam
intencionalmente indisponíveis precisam de rótulo e explicação, não de uma
ação silenciosa. Defeitos críticos de navegação, consentimento, exportação ou
ação financeira são bloqueadores da publicação seguinte.

## Revisão de segurança obrigatória

A revisão de segurança ocorre antes das novas landings e novamente antes de
qualquer código AdSense. Ela é uma avaliação, não autorização automática para
alterações destrutivas ou mudança de infraestrutura. Cada achado terá
evidência, impacto, prioridade, recomendação e responsável.

O escopo mínimo inclui:

- verificação de segredos no repositório, no bundle publicado e em arquivos de
  ambiente; nenhuma chave privada, token de serviço ou credencial pode chegar
  ao cliente;
- inventário de dependências, vulnerabilidades conhecidas e versões
  descontinuadas;
- validação de entradas de URL, busca, alertas, exportações e parâmetros de
  ferramenta contra XSS, redirecionamento aberto e estado inválido;
- revisão do consentimento GA4, armazenamento local e ausência de PII nos
  eventos;
- cabeçalhos HTTP, HTTPS/TLS, redirecionamento, CSP, proteção contra framing,
  `nosniff`, política de referrer e cache de arquivos sensíveis no Nginx;
- confirmação de que `robots.txt`, sitemap e páginas pré-renderizadas não
  expõem portfolio, preferências, tokens, dados de carteira ou rotas privadas;
- teste de links externos com `rel="noopener noreferrer"` e análise das
  integrações de terceiros, incluindo fontes de dados de mercado;
- nova revisão de consentimento publicitário, cookies e Política de
  Privacidade antes de inserir qualquer script de anúncios.

Achados críticos ou altos precisam ser corrigidos e verificados antes do
deploy. Achados médios e baixos entram em backlog com justificativa, prazo e
risco residual documentados.

## Linha de base do PageSpeed Insights

Medição fornecida em 11 de setembro de 2026 para
`https://mobiledelivery.com.br/cripto-dashboard/`:

| Ambiente | Performance | Acessibilidade | Boas práticas | SEO | Dados de campo |
| --- | ---: | ---: | ---: | ---: | --- |
| Mobile | 56 | 91 | 96 | 61 | indisponíveis |
| Desktop | 88 | 91 | 96 | 61 | indisponíveis |

A captura mostra onboarding e banner de consentimento na renderização. A
próxima auditoria precisa preservar essa condição e registrar também as
oportunidades detalhadas de LCP, INP/TBT, CLS, imagens, JavaScript e auditorias
de SEO, que não aparecem na captura atual. Sem essa lista não se deve atribuir
uma causa específica à nota mobile.

Metas de aceitação para a rodada de otimização, medidas sem cache e com a URL
canônica publicada:

- Mobile: Performance >= 80, Acessibilidade >= 95, Boas práticas >= 95 e SEO
  >= 90.
- Desktop: Performance >= 90, Acessibilidade >= 95, Boas práticas >= 95 e SEO
  >= 90.
- Sem regressão em `npm run test`, `npm run build` e nas páginas pré-renderizadas.

As notas Lighthouse são diagnósticos de laboratório; quando houver volume de
tráfego, Search Console e CrUX serão a referência de Core Web Vitals reais.

## Escopo deliberadamente excluído

- Login, paywall, coleta de dados pessoais ou dados de carteira indexáveis.
- Script AdSense, anúncios automáticos e estimativa de receita.
- Novas fontes pagas de mercado e novos modelos financeiros.
- Transformar a plataforma em site de notícias ou publicar conteúdo em escala
  sem revisão editorial.

## Critérios de pronto da futura entrega

1. A revisão visual foi aprovada e seus ajustes críticos foram concluídos.
2. A auditoria funcional foi concluída, com evidência para todos os controles
   no escopo e sem defeitos bloqueadores abertos.
3. A revisão de segurança foi concluída, sem achados críticos ou altos abertos.
4. Cada landing publicada representa uma ferramenta que funciona sem login.
5. Cada CTA abre a aba correta por URL e valores inválidos são seguros.
6. Páginas públicas são pré-renderizadas, canônicas, indexáveis quando
   apropriado e aparecem no sitemap.
7. Todas incluem explicação original, limitações, fontes e aviso de risco.
8. Nenhum anúncio ou requisição publicitária é carregado.
9. As metas de qualidade são avaliadas com os dados detalhados do PageSpeed;
   exceções ficam documentadas antes do deploy.
