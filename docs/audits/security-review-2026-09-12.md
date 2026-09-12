# Revisão de segurança — 12 de setembro de 2026

**Escopo:** frontend público, artefatos estáticos e configuração publicada.  
**Método:** inspeção sem mutação; achados críticos ou altos exigem correção e
nova validação antes de deploy.

| Área | Verificação | Evidência | Resultado | Prioridade | Recomendação |
| --- | --- | --- | --- | --- | --- |
| Segredos | repositório, `.env*`, bundle e histórico recente | pendente | pendente | - | - |
| Dependências | vulnerabilidades de produção | pendente | pendente | - | - |
| Entrada do cliente | busca, query string e exportação | pendente | pendente | - | - |
| Privacidade | consentimento, `localStorage` e eventos GA4 | pendente | pendente | - | - |
| Servidor | TLS, redirecionamento e cabeçalhos | pendente | pendente | - | - |
| Exposição | sitemap, robots e HTML pré-renderizado | pendente | pendente | - | - |
| Terceiros | links, fontes de dados e scripts externos | pendente | pendente | - | - |

## Critério de prioridade

- **Crítica:** exposição de credencial ou dados sensíveis, execução arbitrária
  ou comprometimento direto de usuário/servidor.
- **Alta:** vetor explorável relevante ou quebra de consentimento/privacidade.
- **Média:** impacto limitado, com alternativa ou pré-condição relevante.
- **Baixa:** endurecimento recomendado sem exploração prática identificada.

## Achados

| ID | Evidência | Impacto | Prioridade | Recomendação | Risco residual |
| --- | --- | --- | --- | --- | --- |
| Nenhum ainda | - | - | - | - | - |
