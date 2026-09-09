# Crescimento público e evolução do Cripto Dashboard

## Decisão

O Cripto Dashboard continuará sendo a ferramenta interativa da Ad Rock, mas deixará de ser a única superfície pública do produto. A estratégia passa a ter duas camadas:

1. conteúdo público, indexável e editorial em rotas próprias;
2. aplicativo interativo em `/cripto-dashboard`, focado em acompanhar mercado, análises e simulações.

Essa separação evita transformar a tela operacional em uma página carregada de anúncios e cria páginas que o Google pode entender, indexar e associar à marca Ad Rock.

## Objetivos

- Tornar a Ad Rock reconhecível como autora e operadora do produto.
- Atrair tráfego orgânico com páginas úteis, originais e atualizadas sobre cripto.
- Preparar o domínio para uma futura avaliação do Google AdSense sem prejudicar a experiência do dashboard.
- Modernizar a hierarquia visual sem migrar de biblioteca de componentes.
- Manter dados reais, fontes visíveis e avisos claros sobre limitações e riscos financeiros.

## Não objetivos da primeira fase

- Não adicionar AdSense antes de haver conteúdo editorial próprio e páginas institucionais.
- Não migrar para Material UI.
- Não alterar regras de investimento, recomendar ativos ou prometer retorno.
- Não substituir os módulos analíticos que já funcionam por uma reconstrução integral.

## Arquitetura de informação

### Camada pública

- `/`: página de apresentação da plataforma e da Ad Rock, com CTA para a ferramenta.
- `/bitcoin-hoje`: leitura editorial do BTC, preço, contexto e fontes.
- `/ethereum-hoje`: leitura editorial do ETH, preço, contexto e fontes.
- `/simulador-dca`: explicação do método, riscos e acesso ao simulador.
- `/indice-fear-greed`: explicação, dado atualizado, histórico resumido e limites do indicador.
- `/glossario`: índice de termos; cada termo relevante ganha URL própria quando houver conteúdo suficiente.
- `/metodologia`, `/sobre`, `/contato`, `/privacidade`, `/termos` e `/aviso-de-risco`.

### Aplicativo

- `/cripto-dashboard`: dashboard operacional, com navegação, alertas, portfolio e gráficos.
- Rotas internas do aplicativo devem ser deep-linkáveis apenas quando sua informação também tiver valor público. Dados pessoais, portfolio e configurações não entram em sitemap.

## Direção visual

O design preserva Tailwind, Radix e shadcn/ui. A mudança é de hierarquia, não de biblioteca:

- dashboard com resumo de mercado primeiro, ações secundárias agrupadas e menos cartões com borda idêntica;
- Trading Pro com gráfico como área dominante e indicadores em `Sheet`/`Drawer` no mobile;
- estados vazios que explicam o próximo passo e não apenas a ausência de dados;
- tipografia, cores semânticas e espaçamento reunidos em tokens da Ad Rock;
- componentes existentes do shadcn/ui como `Sidebar`, `Data Table`, `Chart`, `Empty`, `Field`, `Drawer` e `Button Group` usados como blocos de composição.

## SEO e conteúdo

- Cada página pública tem URL, `title`, meta description, canonical e Open Graph específicos.
- Conteúdo editorial deve ter autoria, data de atualização, fontes e linguagem que separe fato, interpretação e simulação.
- `robots.txt` e `sitemap.xml` listam apenas URLs públicas e canônicas.
- Dados estruturados devem refletir somente conteúdo realmente visível: `Organization`, `WebSite`, `BreadcrumbList` e, quando aplicável, `Article`.
- A página pública precisa ser entregue com conteúdo no HTML inicial via pré-renderização estática ou SSR; não depender somente de dados carregados no cliente.

## AdSense

AdSense é uma consequência, não uma entrega da primeira fase. Antes da inscrição, o domínio deverá ter conteúdo original e útil, páginas de transparência e políticas, propriedade técnica do site e layout que reserve espaços de anúncio sem empurrar ou cobrir a informação. Anúncios nunca devem aparecer em telas de portfolio, configurações ou áreas em que confundam análise com recomendação financeira.

## Critérios de sucesso

- O Google consegue descobrir as páginas públicas por sitemap e links internos.
- Cada página pública tem intenção de busca clara e conteúdo original suficiente para responder a ela.
- A marca Ad Rock, autoria, fontes e aviso de risco são visíveis.
- No mobile, o gráfico de Trading Pro aparece antes de controles secundários.
- O app mantém build de produção funcional e o chunk inicial reduz de forma mensurável.
- A decisão de solicitar AdSense só ocorre após uma auditoria de conteúdo, políticas e experiência.
