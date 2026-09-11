# Preparação para Google AdSense

Última revisão: 11 de setembro de 2026  
Responsável: Ad Rock Digital Mkt — CNPJ 12.520.651/0001-91

## Decisão atual

**Não apto para inscrição ainda.** O código está preparado para revisão, mas a
decisão depende de publicação efetiva, indexação e evidências externas que não
podem ser verificadas localmente.

## Itens já presentes no repositório

- Política de privacidade, termos de uso, política de IA, contato, sobre e
  aviso de risco.
- Conteúdo editorial original, com autoria, data, fontes e linguagem educativa.
- `robots.txt`, sitemap e páginas estáticas públicas para descoberta controlada.
- Consentimento analítico antes de GA4; nenhum anúncio ou script AdSense foi
  instalado.
- Espaço visual de publicidade somente em artigos, depois de conteúdo
  substancial, sem competir com CTAs, gráficos ou áreas privadas.

## Evidências necessárias antes de inscrever

- Confirmar que `https://mobiledelivery.com.br/cripto-dashboard/` serve o
  sitemap, robots e cada rota estática com status HTTP 200.
- Adicionar `VITE_GA_MEASUREMENT_ID=G-YKRNDXXP3S` ao ambiente de produção e
  validar consentimento e eventos no DebugView.
- Validar propriedade no Search Console, enviar sitemap e aguardar rastreamento
  das páginas públicas.
- Obter dados de Mobile Friendly/Core Web Vitals e corrigir regressões.
- Revisar juridicamente políticas e avisos antes da publicação comercial.
- Confirmar que há conteúdo editorial suficiente, atualizado e útil antes de
  submeter o domínio, sem páginas geradas em escala ou reprodução de notícias.

## Regras para uma ativação futura

- A ativação exige aprovação explícita da Ad Rock e uma revisão deste checklist.
- Usar anúncios somente em páginas editoriais públicas; nunca em portfólio,
  alertas, configuração, controles de negociação ou telas com dados privados.
- Não carregar tag de anúncios antes da decisão e do consentimento aplicável.
- Cada slot deve preservar `aria-label="Espaço reservado para publicidade"` e
  respeitar a política vigente da plataforma de anúncios.
