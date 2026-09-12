# Qualidade, revisão visual e ferramentas públicas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validar a experiência pública atual, corrigir riscos bloqueadores e
aprovar a direção visual antes de disponibilizar páginas indexáveis para as
ferramentas existentes.

**Architecture:** Esta entrega começa com uma trilha de auditoria sem login:
comportamento dos controles, segurança, PageSpeed e revisão visual. As
evidências viram documentos versionados. Somente depois da aprovação da
revisão visual serão criados o catálogo tipado de ferramentas, os links
profundos e as landings públicas; eles pertencem a uma implementação posterior
porque dependem das decisões de design desta entrega.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Testing Library, Tailwind,
shadcn/ui, Chrome/Playwright para validação assistida e Nginx na publicação.

**Spec:** `docs/superpowers/specs/2026-09-11-public-tools-and-performance-design.md`

## Global Constraints

- Manter todas as ferramentas úteis utilizáveis sem login.
- Não adicionar Material UI, AdSense, scripts de publicidade ou rastreadores
  adicionais.
- Não testar com dados pessoais, chaves de API, carteira ou credenciais reais.
- Não realizar alterações de infraestrutura durante a revisão de segurança sem
  apresentar o achado e obter autorização específica.
- Registrar fatos observados; não inferir sucesso de um botão apenas porque ele
  existe na tela.
- Tratar achados críticos e altos como bloqueadores do próximo deploy.
- Preservar `npm run test` e `npm run build` em qualquer correção aprovada.

## Escopo de controle para auditoria

| Área | Controles que precisam de evidência |
| --- | --- |
| Estrutura | header desktop, menu mobile, sidebar, navegação inferior, links do rodapé e links institucionais |
| Navegação | dashboard, trading, on-chain, modelos, DCA, Stock-to-Flow, portfolio, charts, relatório, alertas e legado |
| Dados | atualizar, busca global, troca de ativo, timeframe, indicadores, filtros, abas, gráficos e estados de erro |
| Utilidades | tema, idioma, notificações, favoritos, alertas, exportações e relatórios |
| Transparência | onboarding, fechar/reabrir onboarding, consentimento, aceitar/recusar/reabrir preferências e link de privacidade |
| Acessibilidade | Tab, Shift+Tab, Enter, Espaço e Escape em menus, dialogs, sheets e popovers |
| Externo | e-mail, WhatsApp, GitHub, Ad Rock e links de fontes |

## Task 1: Criar os relatórios de auditoria reproduzíveis — em validação

**Files:**
- Create: `docs/audits/functional-audit-2026-09-12.md`
- Create: `docs/audits/security-review-2026-09-12.md`
- Create: `docs/audits/pagespeed-2026-09-12.md`
- Modify: `ROADMAP.md`

**Interfaces:**
- Consumes: a URL canônica publicada e o inventário de controles desta seção.
- Produces: três relatórios com status `pendente`, `aprovado`, `falhou` ou
  `bloqueado`, usados nas Tasks 2–5.

- [x] **Step 1: Criar o relatório funcional com a matriz de evidências**

Adicionar uma linha para cada controle do escopo, com as colunas abaixo. Não
agrupar controles com efeitos diferentes.

```md
| ID | Tela/viewport | Controle | Ação | Resultado esperado | Resultado observado | Evidência | Status | Gravidade | Decisão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NAV-01 | desktop | Sidebar: Trading | Clique | abre a visão Trading | pendente | pendente | pendente | - | - |
| CONSENT-01 | mobile | Aceitar análise | Clique | persiste consentimento e fecha banner | pendente | pendente | pendente | - | - |
```

- [x] **Step 2: Criar o relatório de segurança com método e escopo fixos**

Iniciar o relatório com esta tabela de áreas, para que cada linha seja
preenchida com evidência de comando, arquivo ou resposta HTTP:

```md
| Área | Verificação | Evidência | Resultado | Prioridade | Recomendação |
| --- | --- | --- | --- | --- | --- |
| Segredos | repositório, `.env*`, bundle e histórico recente | pendente | pendente | - | - |
| Dependências | vulnerabilidades de produção | pendente | pendente | - | - |
| Entrada do cliente | busca, query string e exportação | pendente | pendente | - | - |
| Privacidade | consentimento, `localStorage` e eventos GA4 | pendente | pendente | - | - |
| Servidor | TLS, redirecionamento e cabeçalhos | pendente | pendente | - | - |
| Exposição | sitemap, robots e HTML pré-renderizado | pendente | pendente | - | - |
```

- [x] **Step 3: Criar o relatório PageSpeed com a linha de base conhecida**

Registrar as notas da captura do usuário e reservar campos para as
oportunidades detalhadas do relatório:

```md
| Perfil | Performance | Acessibilidade | Boas práticas | SEO | Dados de campo |
| --- | ---: | ---: | ---: | ---: | --- |
| Mobile, 2026-09-11 | 56 | 91 | 96 | 61 | indisponíveis |
| Desktop, 2026-09-11 | 88 | 91 | 96 | 61 | indisponíveis |
```

As seções obrigatórias são: LCP, INP/TBT, CLS, JavaScript, imagens, fontes,
acessibilidade e SEO. Cada oportunidade posterior terá valor estimado, origem,
mudança proposta e nova medição.

- [x] **Step 4: Atualizar o roadmap**

Adicionar o marco “Auditoria de qualidade e segurança” antes da expansão das
ferramentas públicas, com links relativos aos três relatórios.

- [x] **Step 5: Verificar os documentos**

Run: `git diff --check && rg -n "functional-audit|security-review|pagespeed" ROADMAP.md docs/audits`

Expected: todos os relatórios existem, contêm a matriz solicitada e não há
erro de whitespace.

- [x] **Step 6: Commit**

```bash
git add ROADMAP.md docs/audits
git commit -m "docs: add quality review evidence templates"
```

## Task 2: Executar a auditoria funcional pública

**Files:**
- Modify: `docs/audits/functional-audit-2026-09-12.md`
- Test: testes existentes em `src/**/*.test.*`

**Interfaces:**
- Consumes: matriz criada na Task 1 e o site em produção.
- Produces: evidência objetiva por controle e lista de defeitos reproduzíveis.

- [ ] **Step 1: Preparar sessões limpas de desktop e mobile**

Abrir `https://mobiledelivery.com.br/cripto-dashboard/` em uma sessão sem
dados locais; usar viewport desktop de 1440x900 e mobile de 390x844. Registrar
data, browser e viewport no cabeçalho do relatório.

- [ ] **Step 2: Validar navegação e ações sem efeitos externos**

Executar cada linha das áreas Estrutura, Navegação, Dados e Utilidades. Para
cada ação, registrar a aba ativa, mudança visual, URL, toast, download ou
estado de erro que confirma o resultado. Não disparar webhooks, notificações
reais, e-mails ou mensagens de WhatsApp durante o teste.

- [ ] **Step 3: Validar transparência e teclado**

Em sessão limpa, testar recusar e aceitar consentimento, reabrir preferências,
abrir o link de privacidade e concluir/fechar o onboarding. Repetir menus,
sheets e dialogs com Tab, Shift+Tab, Enter, Espaço e Escape; documentar a
ordem de foco e qualquer foco perdido.

- [ ] **Step 4: Validar destinos externos sem acionar ações irreversíveis**

Inspecionar `href`, `target` e `rel` de e-mail, WhatsApp, GitHub, Ad Rock e
fontes. Para links HTTP, confirmar que a URL e o destino existem; não enviar
formulários nem mensagens.

- [ ] **Step 5: Confirmar a base automatizada**

Run: `npm run test && npm run build`

Expected: testes e build concluídos. Falhas existentes são registradas como
achado com comando e saída resumida.

- [ ] **Step 6: Classificar e publicar o resultado**

Usar `Crítica` para exposição de dados, consentimento inválido, navegação
inutilizável ou ação financeira indevida; `Alta` para função central quebrada;
`Média` para alternativa disponível; `Baixa` para acabamento. Preencher cada
linha da matriz sem deixar status pendente.

- [ ] **Step 7: Commit**

```bash
git add docs/audits/functional-audit-2026-09-12.md
git commit -m "docs: record public control audit"
```

## Task 3: Executar a revisão de segurança sem mutação — em andamento

**Files:**
- Modify: `docs/audits/security-review-2026-09-12.md`
- Read: `.env.example`, `src/lib/analytics.ts`, `src/components/privacy/CookieConsent.tsx`, `public/robots.txt`, `public/sitemap.xml`, `vite.config.ts`

**Interfaces:**
- Consumes: relatório de segurança da Task 1 e o bundle de produção local.
- Produces: lista classificada de achados, sem aplicar correções automaticamente.

- [ ] **Step 1: Usar a revisão de segurança do repositório**

Seguir a skill `codex-security:security-scan`, com escopo do repositório e
componente de frontend. Registrar apenas evidência necessária, sem copiar
segredos potencialmente encontrados para o relatório.

- [ ] **Step 2: Verificar dependências e segredos de forma segura**

Run: `npm audit --omit=dev`

Run: `rg -n --hidden --glob '!.git/**' --glob '!node_modules/**' '(AKIA|AIza|ghp_|xox[baprs]-|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY)' .`

Expected: vulnerabilidades são listadas por pacote e severidade; qualquer
possível segredo é redigido no relatório e removido da saída compartilhada.

- [ ] **Step 3: Revisar entradas e privacidade do cliente**

Ler os pontos de busca, query string, exportação e analytics. Confirmar que
`ferramenta` não existe ainda como entrada pública, que o termo de busca não é
enviado ao GA4 e que o consentimento começa negado. Registrar arquivos e
linhas, comportamento e risco residual.

- [ ] **Step 4: Inspecionar a superfície publicada**

Verificar `robots.txt`, `sitemap.xml`, HTML pré-renderizado, redirecionamento
HTTP para HTTPS e os cabeçalhos de resposta da URL canônica. Registrar CSP,
X-Frame-Options ou `frame-ancestors`, `X-Content-Type-Options`,
Referrer-Policy, HSTS e Cache-Control como presente, ausente ou não aplicável.

- [ ] **Step 5: Classificar achados e abrir a decisão**

Usar o modelo `ID`, `evidência`, `impacto`, `prioridade`, `recomendação` e
`risco residual`. Não corrigir achados nesta task; apresentar os críticos e
altos ao usuário antes de editar código ou Nginx.

- [ ] **Step 6: Commit**

```bash
git add docs/audits/security-review-2026-09-12.md
git commit -m "docs: record security review"
```

## Task 4: Coletar diagnóstico PageSpeed e consolidar prioridades

**Files:**
- Modify: `docs/audits/pagespeed-2026-09-12.md`

**Interfaces:**
- Consumes: linha de base da Task 1 e a URL publicada.
- Produces: lista priorizada de causas observadas, não apenas notas gerais.

- [ ] **Step 1: Gerar novas auditorias mobile e desktop**

Executar PageSpeed Insights na URL canônica, mantendo onboarding e consentimento
visíveis no carregamento inicial. Registrar horário, perfil e cada métrica
mostrada: FCP, LCP, TBT/INP, CLS, Speed Index e Total Blocking Time quando
disponível.

- [ ] **Step 2: Registrar oportunidades por causa**

Para cada oportunidade, preencher:

```md
| ID | Perfil | Oportunidade observada | Impacto estimado | Arquivo/serviço provável | Mudança candidata | Dependência |
| --- | --- | --- | --- | --- | --- | --- |
```

Não atribuir causa a JavaScript, imagem ou CSS sem a auditoria correspondente.

- [ ] **Step 3: Separar ganhos semânticos de ganhos de carregamento**

Classificar auditorias SEO e acessibilidade separadamente de LCP/TBT/CLS.
Priorizar primeiro o item que reduz bloqueio do usuário no mobile, depois
problemas de rastreabilidade e semântica.

- [ ] **Step 4: Atualizar a conclusão**

Definir as três primeiras mudanças pela relação impacto/esforço e indicar se
cada uma pode ocorrer junto da revisão visual ou precisa de uma entrega isolada.

- [ ] **Step 5: Commit**

```bash
git add docs/audits/pagespeed-2026-09-12.md
git commit -m "docs: record pagespeed diagnostics"
```

## Task 5: Produzir e aprovar a revisão de design

**Files:**
- Create: `docs/design-reviews/2026-09-12-dashboard-review.md`
- Modify: `docs/superpowers/specs/2026-09-11-public-tools-and-performance-design.md`

**Interfaces:**
- Consumes: achados das Tasks 2–4 e componentes de navegação atuais.
- Produces: decisões visuais aprovadas, com escopo explícito para a próxima
  implementação.

- [ ] **Step 1: Revisar os fluxos principais no desktop e mobile**

Avaliar: chegada ao dashboard, descoberta de Trading, DCA e On-chain, retorno
ao panorama, leitura de dados e interação com consentimento/onboarding. Para
cada fluxo, registrar problema, evidência, princípio de design, prioridade e
recomendação.

- [ ] **Step 2: Definir o resultado visual por área**

O documento deve decidir, sem ambiguidade, a hierarquia do dashboard inicial,
os grupos da navegação, o papel da sidebar, o cabeçalho mobile, a tipografia,
o uso de cards, o comportamento do onboarding e a posição do consentimento.
Associar cada decisão aos arquivos atuais: `Index.tsx`, `Sidebar.tsx`,
`MobileBottomNav.tsx`, `CookieConsent.tsx` e `src/index.css`.

- [ ] **Step 3: Relacionar decisões aos achados de qualidade**

Marcar cada decisão como `funcional`, `acessibilidade`, `performance`,
`segurança` ou `identidade visual`. Itens bloqueadores das Tasks 2 e 3 têm
prioridade sobre refinamentos estéticos.

- [ ] **Step 4: Solicitar aprovação do usuário**

Apresentar a revisão com as decisões e capturas/evidências. Não modificar a
interface antes de uma aprovação explícita.

- [ ] **Step 5: Commit**

```bash
git add docs/design-reviews docs/superpowers/specs/2026-09-11-public-tools-and-performance-design.md
git commit -m "docs: record dashboard design review"
```

## Task 6: Planejar a implementação após a revisão aprovada

**Files:**
- Create: `docs/superpowers/plans/2026-09-12-dashboard-redesign.md`
- Create: `docs/superpowers/plans/2026-09-12-public-tool-catalog.md`

**Interfaces:**
- Consumes: revisão de design aprovada, matriz funcional, achados de segurança
  aceitos e diagnóstico PageSpeed.
- Produces: dois planos independentes: correção/redesign do dashboard e
  catálogo público com `PublicTool`, links `?ferramenta=`, rotas, sitemap e
  pré-renderização.

- [ ] **Step 1: Escrever o plano de redesign**

Incluir apenas as decisões visuais aprovadas, as correções bloqueadoras e as
otimizações PageSpeed priorizadas. Cada tarefa terá teste automatizado ou
evidência de interface e um commit independente.

- [ ] **Step 2: Escrever o plano do catálogo público**

Definir `PublicTool`, a validação de `DashboardTab`, sincronização segura de
query string, rotas `/ferramentas`, metadados, sitemap e conteúdo por
ferramenta existente. Manter publicidade desativada.

- [ ] **Step 3: Revisar os planos com o usuário**

Solicitar aprovação antes de mudar layout, URL pública, sitemap ou textos
editoriais.

## Auto-revisão do plano

- Cobertura: Tasks 1–4 criam e concluem as evidências exigidas; Task 5 produz
  a decisão visual que bloqueia a expansão; Task 6 separa os dois subsistemas
  de implementação para evitar mudança de interface e SEO no escuro.
- Segurança: nenhuma etapa de inspeção altera Nginx, conta GA4, AdSense ou
  dados do usuário; correções precisam de decisão posterior.
- Dependências: o catálogo público não começa antes de auditarmos botões,
  segurança, PageSpeed e aprovarmos o design.
