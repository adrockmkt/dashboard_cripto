export interface EditorialPage {
  slug: string;
  title: string;
  description: string;
  author: string;
  updatedAt: string;
  sources: Array<{ label: string; url: string }>;
  sections: Array<{ heading: string; body: string }>;
}

const commonSource = { label: "Aviso de risco do Cripto Dashboard", url: "/aviso-de-risco" };

export const editorialPages: Record<string, EditorialPage> = {
  "bitcoin-hoje": {
    slug: "bitcoin-hoje",
    title: "Bitcoin hoje: um roteiro para interpretar o mercado",
    description: "Um guia original da Ad Rock para organizar a leitura de preço, liquidez, contexto e risco do Bitcoin, sem recomendações de investimento.",
    author: "Equipe editorial da Ad Rock",
    updatedAt: "11 de setembro de 2026",
    sources: [
      { label: "Bitcoin.org — introdução ao Bitcoin", url: "https://bitcoin.org/pt_BR/" },
      { label: "Documentação do Bitcoin Developer", url: "https://developer.bitcoin.org/" },
      commonSource,
    ],
    sections: [
      { heading: "Comece pelo contexto, não pelo último preço", body: "Uma variação isolada não explica o mercado. Antes de tirar conclusões, observe o período analisado, a liquidez, o volume disponível e eventos que possam afetar a negociação." },
      { heading: "Separe informação de decisão", body: "Gráficos e indicadores ajudam a formular perguntas, mas não eliminam risco. Uma leitura responsável considera horizonte, tolerância a perdas e fontes verificáveis antes de qualquer decisão." },
      { heading: "Confira a fonte e o horário", body: "Dados podem ter atraso, metodologia diferente ou indisponibilidade temporária. Registre a origem e o momento da consulta para evitar comparar informações que não representam a mesma janela." },
    ],
  },
  "ethereum-hoje": {
    slug: "ethereum-hoje",
    title: "Ethereum hoje: como acompanhar a rede com contexto",
    description: "Guia da Ad Rock para observar Ethereum, atividade de rede e mercado sem confundir indicadores com recomendações.",
    author: "Equipe editorial da Ad Rock",
    updatedAt: "11 de setembro de 2026",
    sources: [
      { label: "Ethereum.org — visão geral da rede", url: "https://ethereum.org/pt-br/" },
      { label: "Documentação Ethereum", url: "https://ethereum.org/developers/docs/" },
      commonSource,
    ],
    sections: [
      { heading: "Preço e rede respondem a perguntas diferentes", body: "O preço representa negociações em mercados; métricas de rede descrevem atividade técnica. Elas podem se mover em ritmos distintos e devem ser lidas como contextos complementares." },
      { heading: "Entenda o indicador antes de compará-lo", body: "Taxas, transações e atividade de contratos dependem de método, período e fornecedor. Compare apenas séries com definição clara e janela equivalente." },
      { heading: "Mantenha uma trilha de verificação", body: "Ao usar dados externos, guarde fonte, data e limitações informadas. Isso favorece análises reproduzíveis e reduz interpretações apressadas." },
    ],
  },
  "fear-greed-cripto": {
    slug: "fear-greed-cripto",
    title: "Índice de medo e ganância cripto: como usar com cautela",
    description: "Entenda o que um índice de sentimento pode sinalizar, suas limitações e como evitar que ele substitua uma análise completa.",
    author: "Equipe editorial da Ad Rock",
    updatedAt: "11 de setembro de 2026",
    sources: [
      { label: "Alternative.me — Crypto Fear & Greed Index", url: "https://alternative.me/crypto/fear-and-greed-index/" },
      commonSource,
    ],
    sections: [
      { heading: "Sentimento não é previsão", body: "Indicadores de medo e ganância resumem sinais de mercado em uma metodologia específica. Eles não antecipam movimentos futuros nem substituem avaliação de risco." },
      { heading: "Leia mudanças, não só extremos", body: "Uma pontuação isolada é menos útil que sua evolução ao longo do tempo e o ambiente de mercado em que foi produzida." },
      { heading: "Evite automatizar conclusões", body: "Use o indicador para investigar hipóteses e procurar fontes adicionais; não para transformar uma emoção agregada em ordem de compra ou venda." },
    ],
  },
  "guia-dca-cripto": {
    slug: "guia-dca-cripto",
    title: "DCA em cripto: o que avaliar antes de simular aportes",
    description: "Um guia educativo sobre aportes periódicos em criptoativos, seus limites, custos e variáveis que uma simulação precisa explicitar.",
    author: "Equipe editorial da Ad Rock",
    updatedAt: "11 de setembro de 2026",
    sources: [
      { label: "CVM — Portal do Investidor", url: "https://www.gov.br/investidor/pt-br" },
      commonSource,
    ],
    sections: [
      { heading: "DCA descreve frequência, não qualidade do ativo", body: "Aportes periódicos distribuem entradas no tempo. Eles não removem volatilidade, riscos de custódia, taxas ou a possibilidade de perdas." },
      { heading: "Simulações dependem de premissas", body: "Valor, frequência, taxa, período e fonte de preço alteram o resultado. Uma projeção deve expor essas premissas e nunca ser apresentada como garantia." },
      { heading: "Planejamento vem antes da ferramenta", body: "Defina objetivos, horizonte e capacidade de perda antes de comparar cenários. Recursos do dashboard são informativos e não personalizam recomendações." },
    ],
  },
  "glossario-cripto": {
    slug: "glossario-cripto",
    title: "Glossário cripto: conceitos para ler dados com clareza",
    description: "Definições concisas e originais para termos recorrentes em criptomoedas, blockchain, liquidez e custódia.",
    author: "Equipe editorial da Ad Rock",
    updatedAt: "11 de setembro de 2026",
    sources: [
      { label: "Bitcoin Developer — glossário técnico", url: "https://developer.bitcoin.org/glossary.html" },
      { label: "Ethereum.org — glossário", url: "https://ethereum.org/pt-br/glossary/" },
      commonSource,
    ],
    sections: [
      { heading: "Blockchain", body: "Estrutura de registros compartilhados em rede, com regras próprias de validação. Implementações diferentes podem ter objetivos e garantias distintas." },
      { heading: "Liquidez", body: "Facilidade de negociar um ativo sem provocar grande alteração no preço. Liquidez varia por mercado, horário e volume disponível." },
      { heading: "Custódia", body: "Forma de guardar e controlar chaves ou acesso aos criptoativos. A escolha envolve riscos operacionais e de segurança que o dashboard não elimina." },
    ],
  },
};
