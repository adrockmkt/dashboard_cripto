import type { ToolGuide } from "@/components/public/ToolGuideLayout";

const risk = { label: "Aviso de risco", href: "/aviso-de-risco" };
const glossary = { label: "Glossário cripto", href: "/glossario-cripto" };

export const toolGuides: Record<string, ToolGuide> = {
  "metricas-on-chain": {
    slug: "metricas-on-chain",
    title: "Métricas on-chain: como ler atividade, hashrate, mempool e taxas",
    description: "Use dados públicos da rede Bitcoin para contextualizar atividade e custos, sem confundir métricas técnicas com recomendação de investimento.",
    updatedAt: "14 de setembro de 2026",
    intro: "A ferramenta reúne endereços ativos, hashrate, transações pendentes e taxas recomendadas. Ela foi feita para que você confira a origem e a data do dado antes de formar uma hipótese.",
    steps: [
      "Abra Métricas On-Chain no dashboard e verifique o selo de disponibilidade dos dados.",
      "Compare a série histórica de uma métrica por vez, observando a data do último ponto disponível.",
      "Use as taxas recomendadas apenas como referência operacional: confirme condições na sua carteira ou serviço antes de enviar uma transação.",
    ],
    interpretation: "Mais atividade ou hashrate não determinam, por si só, a direção do preço. O valor está em comparar a evolução da rede com o período, a fonte e outros fatores de mercado.",
    limitations: "Fontes públicas podem atrasar, mudar metodologia ou ficar indisponíveis. O score de saúde resume faixas relativas do período; não mede segurança individual, não prevê preço e não substitui validação independente.",
    dashboardHref: "/",
    relatedLinks: [glossary, { label: "Índice de medo e ganância", href: "/fear-greed-cripto" }, risk],
    sources: [
      { label: "Blockchain.com Charts", url: "https://www.blockchain.com/explorer/charts" },
      { label: "mempool.space API", url: "https://mempool.space/docs/api/rest" },
    ],
  },
  "alertas-cripto": {
    slug: "alertas-cripto",
    title: "Alertas cripto: como configurar sinais sem delegar sua decisão",
    description: "Entenda os alertas de preço e indicadores do Cripto Dashboard, o que cada condição monitora e quais canais estão realmente disponíveis.",
    updatedAt: "14 de setembro de 2026",
    intro: "Alertas reduzem a necessidade de acompanhar a tela continuamente. Eles indicam que uma condição configurada foi observada; não são uma ordem, conselho ou garantia de execução.",
    steps: [
      "Abra Alertas e escolha Novo Alerta para definir nome, métrica, condição, valor e período.",
      "Dê nomes que expliquem o contexto, como uma faixa de preço ou um nível de indicador que você deseja revisar.",
      "Mantenha som, aviso visual ou notificação do navegador somente nos dispositivos que você controla.",
    ],
    interpretation: "Quando um alerta ocorre, revise o preço, a fonte, a liquidez e seu próprio plano antes de tomar qualquer ação. Um cruzamento de valor não explica sozinho o motivo do movimento.",
    limitations: "Alertas dependem da atualização dos fornecedores e da disponibilidade do navegador. E-mail e webhook não estão ativos nesta versão para evitar entrega insegura diretamente pelo navegador.",
    dashboardHref: "/",
    relatedLinks: [{ label: "Como interpretar Bitcoin hoje", href: "/bitcoin-hoje" }, glossary, risk],
    sources: [
      { label: "MDN — Notifications API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" },
      { label: "Aviso de risco do Cripto Dashboard", url: "/aviso-de-risco" },
    ],
  },
  "simulador-dca": {
    slug: "simulador-dca",
    title: "Simulador DCA: como testar aportes periódicos com premissas claras",
    description: "Aprenda a explorar cenários de aporte recorrente em criptoativos e reconhecer o que uma simulação não consegue prometer.",
    updatedAt: "14 de setembro de 2026",
    intro: "DCA descreve a distribuição de aportes no tempo. O simulador ajuda a explicitar valor, frequência e horizonte; ele não remove volatilidade, custos, risco de custódia ou a possibilidade de perdas.",
    steps: [
      "Abra Modelos e selecione Simulador DCA.",
      "Informe valores compatíveis com um cenário hipotético e revise período, frequência e taxa antes de comparar resultados.",
      "Use as abas e exportações para registrar premissas, não como previsão ou recomendação personalizada.",
    ],
    interpretation: "O resultado só descreve as variáveis informadas e a série de preço usada pela ferramenta. Compare cenários diferentes para entender sensibilidade, sem tratar o número final como retorno esperado.",
    limitations: "Desempenho passado não garante resultado futuro. Taxas, spreads, impostos, liquidez, inflação e eventos de custódia podem alterar materialmente a experiência real.",
    dashboardHref: "/",
    relatedLinks: [{ label: "Guia de DCA em cripto", href: "/guia-dca-cripto" }, { label: "Metodologia", href: "/metodologia" }, risk],
    sources: [
      { label: "CVM — Portal do Investidor", url: "https://www.gov.br/investidor/pt-br" },
      { label: "Aviso de risco do Cripto Dashboard", url: "/aviso-de-risco" },
    ],
  },
  "grafico-bitcoin": {
    slug: "grafico-bitcoin",
    title: "Gráfico de Bitcoin: como usar velas e indicadores com contexto",
    description: "Veja como organizar uma leitura de gráfico de Bitcoin, alternar período e indicadores sem transformar análise técnica em certeza.",
    updatedAt: "14 de setembro de 2026",
    intro: "O gráfico Trading Pro apresenta preço e indicadores técnicos em uma única tela. Ele serve para explorar comportamento histórico e níveis de interesse, não para afirmar o próximo movimento do mercado.",
    steps: [
      "Abra Trading Pro e confira o ativo e o intervalo de tempo selecionados.",
      "Ative apenas os indicadores que respondem à pergunta que você está investigando e evite sobrepor sinais sem critério.",
      "Atualize o gráfico e confira a fonte antes de comparar com outros períodos ou plataformas.",
    ],
    interpretation: "Velas, RSI, MACD, Bollinger e volume descrevem aspectos distintos. Convergência visual não equivale a confirmação: contexto, liquidez e risco continuam necessários.",
    limitations: "Cotações podem ter atraso e indicadores mudam conforme período e fórmula. O gráfico não executa operações, não considera seu perfil e não oferece aconselhamento financeiro.",
    dashboardHref: "/",
    relatedLinks: [{ label: "Bitcoin hoje", href: "/bitcoin-hoje" }, { label: "Índice de medo e ganância", href: "/fear-greed-cripto" }, risk],
    sources: [
      { label: "TradingView — documentação", url: "https://www.tradingview.com/support/" },
      { label: "Bitcoin Developer Documentation", url: "https://developer.bitcoin.org/" },
    ],
  },
};
