import { buildPageMeta, type PageMeta } from "@/lib/seo";

export interface PublicRoute {
  path: string;
  meta: PageMeta;
}

const routeDefinitions = [
  {
    path: "/sobre",
    title: "Sobre a plataforma",
    description: "Conheça a proposta do Cripto Dashboard, ferramenta da Ad Rock para acompanhar o mercado cripto com mais contexto.",
  },
  {
    path: "/metodologia",
    title: "Metodologia",
    description: "Entenda como o Cripto Dashboard organiza dados, indicadores e fontes para apoiar análises de mercado.",
  },
  {
    path: "/contato",
    title: "Contato",
    description: "Fale com a Ad Rock Digital Mkt sobre o Cripto Dashboard e suas informações institucionais.",
  },
  {
    path: "/privacidade",
    title: "Política de privacidade",
    description: "Veja como a Ad Rock trata dados e preferências analíticas no Cripto Dashboard.",
  },
  {
    path: "/termos",
    title: "Termos de uso",
    description: "Leia as condições de uso, responsabilidades e limites do Cripto Dashboard.",
  },
  {
    path: "/politica-de-ia",
    title: "Política de IA",
    description: "Conheça os princípios de transparência, supervisão humana e uso responsável de IA no Cripto Dashboard.",
  },
  {
    path: "/aviso-de-risco",
    title: "Aviso de risco",
    description: "Entenda os riscos de criptoativos e os limites informacionais do Cripto Dashboard.",
  },
  {
    path: "/bitcoin-hoje",
    title: "Bitcoin hoje: como interpretar o mercado",
    description: "Guia original da Ad Rock para organizar a leitura de Bitcoin com contexto, fontes e aviso de risco.",
  },
  {
    path: "/ethereum-hoje",
    title: "Ethereum hoje: como acompanhar a rede",
    description: "Guia da Ad Rock para observar Ethereum e indicadores de rede sem transformar informação em recomendação.",
  },
  {
    path: "/fear-greed-cripto",
    title: "Índice de medo e ganância cripto",
    description: "Entenda limites e usos responsáveis de índices de sentimento no mercado de criptoativos.",
  },
  {
    path: "/guia-dca-cripto",
    title: "Guia de DCA em cripto",
    description: "Conteúdo educativo sobre aportes periódicos, simulações e riscos de criptoativos.",
  },
  {
    path: "/glossario-cripto",
    title: "Glossário cripto",
    description: "Definições claras para conceitos de blockchain, liquidez e custódia.",
  },
] as const;

export const publicRoutes: PublicRoute[] = routeDefinitions.map((route) => ({
  path: route.path,
  meta: buildPageMeta(route),
}));

export function getPublicRoute(path: string) {
  return publicRoutes.find((route) => route.path === path);
}
