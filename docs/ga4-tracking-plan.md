# Plano de tracking GA4 — Cripto Dashboard

**Propriedade GA4:** `G-YKRNDXXP3S`

**URL canônica:** `https://mobiledelivery.com.br/cripto-dashboard/`
**Atualizado em:** 2026-09-11

## Objetivo

Medir descoberta, navegação e uso de recursos do produto para priorizar
conteúdo e melhorias de interface. O tracking não mede decisões de investimento,
valores de portfolio, e-mails, telefones, identificadores de carteira, chaves de
API, termos de busca livres ou outros dados pessoais.

## Base de privacidade

- GA4 será carregado somente depois do consentimento para cookies analíticos.
- O estado padrão será `analytics_storage: "denied"` e o site atualizará o
  consentimento somente quando a pessoa escolher aceitar.
- O banner permitirá aceitar, recusar e reabrir as preferências; recusar não
  bloqueia o uso da ferramenta.
- Não habilitar Google Signals, publicidade personalizada, remarketing,
  User-ID, importação de dados de CRM ou enhanced conversions nesta fase.
- Antes de qualquer público do EEE, Reino Unido ou Suíça, validar a solução de
  consentimento e os sinais exigidos pelo Google para a região.

## Eventos automáticos esperados

Após o consentimento, o Google tag poderá registrar os eventos automáticos e de
medição aprimorada habilitados na propriedade, como `page_view`, `first_visit`,
`session_start`, `user_engagement`, scroll e cliques de saída. Esses recursos
devem ser revisados na propriedade antes da publicação.

## Eventos de produto

Todos os eventos abaixo recebem `app_surface` (`public` ou `dashboard`) e
`page_path`; nenhum recebe texto livre, valores monetários ou identificadores de
usuário.

| Evento | Quando dispara | Parâmetros permitidos | Uso |
| --- | --- | --- | --- |
| `view_content` | visita a uma página editorial | `content_type`, `content_slug` | entender interesse por conteúdo |
| `select_content` | CTA entre conteúdo e ferramenta | `content_type`, `content_slug`, `destination` | medir navegação editorial |
| `search` | busca global enviada | `search_scope` | medir uso da busca sem enviar o termo |
| `tutorial_begin` | início do onboarding | `tutorial_name` | adoção inicial |
| `tutorial_complete` | finalização do onboarding | `tutorial_name` | qualidade do onboarding |
| `dashboard_tab_view` | troca de área principal | `tab_name` | priorização de módulos |
| `chart_timeframe_change` | alteração do período do gráfico | `timeframe` | uso de análise técnica |
| `export_data` | exportação iniciada | `export_format`, `export_scope` | valor dos relatórios |
| `create_alert` | alerta validado e salvo | `alert_type` | adoção de alertas |
| `consent_update` | escolha ou alteração de cookies | `analytics_consent` | auditoria agregada do consentimento |

`search`, `tutorial_begin` e `tutorial_complete` seguem nomes recomendados pelo
GA4. Os demais são eventos customizados e exigirão o cadastro das dimensões
customizadas necessárias na interface da propriedade.

## Implementação

1. Expor `VITE_GA_MEASUREMENT_ID` em `.env.example`; o ID real será o informado
   acima em produção.
   `VITE_GA_DEBUG_MODE=true` pode ser usado temporariamente em uma publicação de
   diagnóstico para exibir eventos no DebugView; deve voltar a `false` depois.
2. Criar `src/lib/analytics.ts` com `initializeAnalytics`, `updateAnalyticsConsent`
   e `trackEvent` tipados.
3. Criar `src/components/privacy/CookieConsent.tsx` com persistência local do
   consentimento e link para `/privacidade`.
4. Carregar o Google tag apenas após consentimento analítico; inicializar
   `dataLayer` e Consent Mode antes de qualquer evento.
5. Usar `trackEvent` apenas nos pontos documentados e cobrir cada evento com
   teste unitário.
6. Conferir `page_view` e eventos no DebugView e Realtime, sem dados pessoais,
   antes de publicar.

## Configuração na interface do GA4

- Marcar tráfego interno dos responsáveis pela manutenção para exclusão dos
  relatórios de produção.
- Criar dimensões customizadas de escopo de evento para `app_surface`,
  `content_type`, `content_slug`, `destination`, `search_scope`, `tab_name`,
  `timeframe`, `export_format`, `export_scope`, `alert_type` e
  `analytics_consent`.
- Revisar retenção de dados e permissões de acesso da propriedade.
- Validar o domínio de referência e excluir referências indesejadas caso
  apareçam no relatório de aquisição.

## Critérios de aceite

- Nenhuma requisição GA4 antes da decisão de consentimento analítico.
- DebugView mostra os eventos com apenas os parâmetros permitidos.
- A recusa não reduz a funcionalidade da ferramenta.
- A Política de Privacidade descreve cookies, finalidades, base de escolha e o
  canal `contato@adrock.com.br`.
- A Política de IA e os Termos de Uso estão disponíveis por URL própria e
  linkados no rodapé público.

## Referências

- [Eventos do GA4](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/recommended-events)
- [Coleta de dados no Google Analytics](https://support.google.com/analytics/answer/11593727)
- [Configurações de consentimento do GA4](https://support.google.com/analytics/answer/14275483)
