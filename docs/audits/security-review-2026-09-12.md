# Revisão de segurança — 12 de setembro de 2026

**Escopo:** frontend público, artefatos estáticos e configuração publicada.  
**Método:** inspeção sem mutação; achados críticos ou altos exigem correção e
nova validação antes de deploy.
**Cobertura atual:** parcial. A varredura de fonte continua em andamento; os
achados abaixo já têm evidência suficiente para priorização.

| Área | Verificação | Evidência | Resultado | Prioridade | Recomendação |
| --- | --- | --- | --- | --- | --- |
| Segredos | repositório e arquivos de ambiente locais | somente `.env.example` presente; nenhuma configuração ativa encontrada localmente | parcial | - | confirmar bundle publicado sem imprimir valores |
| Dependências | `npm audit --omit=dev` | 16 vulnerabilidades: 2 críticas, 10 altas, 3 moderadas e 1 baixa | falhou | alta | atualizar dependências com plano de compatibilidade |
| Entrada do cliente | busca, query string e exportação | não há `dangerouslySetInnerHTML`, `eval` ou redirecionamento de URL no código revisado; CSV não neutraliza fórmulas | parcial | média | validar/escapar células CSV antes do download |
| Privacidade | consentimento, `localStorage` e eventos GA4 | Analytics inicia negado; chaves de API são gravadas em `localStorage` pelo componente legado | parcial | média | remover a tela de chaves ou usar backend seguro antes de expor o fluxo |
| Servidor | TLS, redirecionamento e cabeçalhos | pendente de inspeção de resposta publicada | pendente | - | - |
| Exposição | sitemap, robots e HTML pré-renderizado | sitemap contém somente páginas públicas; sourcemaps de produção estão habilitados | parcial | baixa | desabilitar sourcemaps públicos ou controlar seu acesso |
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
| SEC-001 | `npm audit --omit=dev`; `jspdf@3.0.3` é usado em `src/utils/exportData.ts` | O pacote possui alertas críticos do fornecedor. O impacto prático precisa de validação porque a exportação roda no browser, mas o componente entra no bundle público. | alta | atualizar `jspdf` e `jspdf-autotable` de forma compatível; testar CSV/PDF/JSON após a atualização | dependências atuais permanecem vulneráveis até a atualização |
| SEC-002 | `src/sql/schema.sql` não habilita RLS nem cria policies; `src/hooks/useCustomAlerts.ts` consulta e altera tabelas com o cliente anônimo | Se Supabase for configurado com grants públicos, registros de alertas, carteira e histórico podem ser lidos ou modificados entre usuários. A configuração ativa não está presente localmente, portanto a exposição em produção é condicional. | alta | antes de ativar Supabase, habilitar RLS, exigir `auth.uid()` e tornar `user_id` obrigatório nas tabelas pessoais | risco condicionado à futura configuração do Supabase |
| SEC-003 | `src/components/ApiKeyConfig.tsx:23-31` armazena chaves de provedores em `localStorage` | Qualquer XSS no mesmo origin, extensão maliciosa ou pessoa com acesso ao perfil do navegador pode ler as chaves. | média | não coletar chaves no frontend público; usar backend/proxy com segredo do operador ou remover a tela | a tela não está exposta na navegação atual, mas permanece no código |
| SEC-004 | `src/utils/exportData.ts:10-14` grava células CSV sem neutralizar prefixos de fórmula | Dados controláveis por fonte externa ou futuro input podem executar fórmulas ao abrir o CSV em planilhas. | média | prefixar células que começam com `=`, `+`, `-` ou `@` com apóstrofo | requer que dado controlado alcance a exportação |
| SEC-005 | `vite.config.ts:111-113` configura `sourcemap: true` em produção | Mapa de fontes público facilita engenharia reversa; não expõe segredo por si só. | baixa | publicar sem sourcemaps ou hospedá-los fora do acesso público | o código do cliente já é público |
| SEC-006 | console do navegador em 2026-09-12: CORS em CryptoCompare/CoinGecko e resposta 429 | A falha não é comprometimento, mas reduz confiabilidade e pode levar usuários a dados fallback simulados. | média | usar um proxy/serviço de dados com cache, limites e indicação de fonte/fallback | depende de decisão de infraestrutura |
