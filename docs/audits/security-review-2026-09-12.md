# Revisão de segurança — 12 de setembro de 2026

**Escopo:** frontend público, artefatos estáticos e configuração publicada.  
**Método:** inspeção sem mutação; achados críticos ou altos exigem correção e
nova validação antes de deploy.
**Cobertura atual:** parcial. As correções de aplicação abaixo foram
verificadas; a varredura de fonte e os cabeçalhos da publicação continuam
pendentes.

| Área | Verificação | Evidência | Resultado | Prioridade | Recomendação |
| --- | --- | --- | --- | --- | --- |
| Segredos | repositório e arquivos de ambiente locais | somente `.env.example` presente; nenhuma configuração ativa encontrada localmente | parcial | - | confirmar bundle publicado sem imprimir valores |
| Dependências | `npm audit --omit=dev` | restam 2 vulnerabilidades moderadas de React Router; alertas críticos/altos anteriores foram removidos | parcial | média | planejar migração testada para React Router v7 |
| Entrada do cliente | busca, query string e exportação | não há `dangerouslySetInnerHTML`, `eval` ou redirecionamento de URL no código revisado; CSV neutraliza fórmulas | aprovado | - | manter teste de regressão |
| Privacidade | consentimento, `localStorage` e eventos GA4 | Analytics inicia negado; a tela de chaves não lê nem grava chaves no navegador | aprovado | - | manter chaves fora do frontend público |
| Servidor | TLS, redirecionamento e cabeçalhos | resposta publicada contém CSP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options e X-Frame-Options | aprovado | - | revisar CSP ao incluir novos provedores ou AdSense |
| Exposição | sitemap, robots e HTML pré-renderizado | sitemap contém somente páginas públicas; build verificado sem arquivos `.map` | parcial | - | confirmar o artefato publicado após deploy |
| Terceiros | links, fontes de dados e scripts externos | fontes de mercado fazem `fetch` direto no cliente; falhas CORS/429 observadas | parcial | média | migrar fontes para camada de servidor/proxy com limites e cache |

## Critério de prioridade

- **Crítica:** exposição de credencial ou dados sensíveis, execução arbitrária
  ou comprometimento direto de usuário/servidor.
- **Alta:** vetor explorável relevante ou quebra de consentimento/privacidade.
- **Média:** impacto limitado, com alternativa ou pré-condição relevante.
- **Baixa:** endurecimento recomendado sem exploração prática identificada.

## Achados

| ID | Evidência | Impacto | Prioridade | Recomendação | Risco residual |
| --- | --- | --- | --- | --- | --- |
| SEC-001 | `npm audit --omit=dev` após atualização; `jspdf@4.2.1` e `jspdf-autotable@5.0.8` instalados | Alertas críticos do jsPDF removidos do inventário de produção. | resolvido | manter atualização de dependências em rotina | permanecem 2 alertas moderados de React Router |
| SEC-002 | `src/sql/schema.sql` habilita RLS e define policies por `auth.uid()` | O schema futuro não permite acesso anônimo nem cruzado entre usuários nas tabelas pessoais. | resolvido no schema | aplicar o schema somente junto da futura autenticação Supabase | a configuração Supabase ativa não foi inspecionada nem alterada |
| SEC-003 | `src/components/ApiKeyConfig.tsx` não usa mais `localStorage` para chaves | Chaves inseridas são descartadas e a tela informa que não aceita credenciais até haver backend seguro. | resolvido | manter chaves fora do frontend público | extensões maliciosas continuam fora do controle da aplicação |
| SEC-004 | `src/utils/exportData.ts` usa `escapeCsvCell`; teste cobre fórmulas, vírgulas e aspas | Células que começam com prefixo de fórmula são neutralizadas antes do download. | resolvido | manter o teste de regressão | nenhum conhecido |
| SEC-005 | `vite.config.ts` define `sourcemap: false`; build não contém `.map` | Artefato local não publica mapas de fonte. | resolvido localmente | confirmar após deploy | depende do artefato efetivamente publicado |
| SEC-006 | console do navegador em 2026-09-12: CORS em CryptoCompare/CoinGecko e resposta 429 | A falha não é comprometimento, mas reduz confiabilidade e pode levar usuários a dados fallback simulados. | média | usar um proxy/serviço de dados com cache, limites e indicação de fonte/fallback | depende de decisão de infraestrutura |
| SEC-007 | resposta HTTPS de `/cripto-dashboard/` após reload do Nginx; revalidação em 2026-09-13 | Sem cabeçalhos, o browser aceitava mais contextos de execução e integração do que o necessário. A primeira CSP bloqueou o host real dos ícones CoinGecko; a allowlist foi corrigida e uma sessão nova não registrou bloqueios de imagem. | resolvido | manter o snippet `ops/nginx/cripto-dashboard-security.conf` como fonte de verdade e revisar as origens ao integrar AdSense | CSP precisa de ajuste antes de qualquer novo script de terceiro |
