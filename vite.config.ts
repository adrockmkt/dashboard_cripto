import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const publicSeoPages = [
  {
    path: "sobre",
    title: "Sobre a plataforma",
    description: "Conheça a proposta do Cripto Dashboard, ferramenta da Ad Rock para acompanhar o mercado cripto com mais contexto.",
  },
  {
    path: "metodologia",
    title: "Metodologia",
    description: "Entenda como o Cripto Dashboard organiza dados, indicadores e fontes para apoiar análises de mercado.",
  },
  {
    path: "contato",
    title: "Contato",
    description: "Fale com a Ad Rock Digital Mkt sobre o Cripto Dashboard e suas informações institucionais.",
  },
  {
    path: "privacidade",
    title: "Política de privacidade",
    description: "Veja como a Ad Rock trata dados e preferências analíticas no Cripto Dashboard.",
  },
  {
    path: "termos",
    title: "Termos de uso",
    description: "Leia as condições de uso, responsabilidades e limites do Cripto Dashboard.",
  },
  {
    path: "politica-de-ia",
    title: "Política de IA",
    description: "Conheça os princípios de transparência, supervisão humana e uso responsável de IA no Cripto Dashboard.",
  },
  {
    path: "aviso-de-risco",
    title: "Aviso de risco",
    description: "Entenda os riscos de criptoativos e os limites informacionais do Cripto Dashboard.",
  },
];

const publicSiteUrl = "https://mobiledelivery.com.br/cripto-dashboard";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/cripto-dashboard/' : '/',
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      port: 8080,
    },
    allowedHosts: [
      '*.manusvm.computer',
    ],
  },
  optimizeDeps: {
    include: [
      'i18next',
      'react-i18next',
      '@tanstack/react-virtual',
      'jspdf',
      'jspdf-autotable'
    ],
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'copy-sw',
      closeBundle() {
        copyFileSync('public/sw.js', 'dist/sw.js');
      }
    },
    {
      name: "prerender-public-seo-pages",
      closeBundle() {
        const appShell = readFileSync("dist/index.html", "utf8");

        for (const page of publicSeoPages) {
          const canonical = `${publicSiteUrl}/${page.path}`;
          const documentTitle = `${page.title} | Cripto Dashboard · Ad Rock`;
          const staticContent = `<main class="seo-static" aria-labelledby="page-title"><h1 id="page-title">${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p><p><a href="${publicSiteUrl}/">Abrir o Cripto Dashboard</a></p></main>`;
          const html = appShell
            .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(documentTitle)}</title>`)
            .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
            .replace(/<meta name="robots" content=".*?"\s*\/>/, '<meta name="robots" content="index,follow" />')
            .replace("</head>", `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" /></head>`)
            .replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);
          const outputDirectory = `dist/${page.path}`;

          mkdirSync(outputDirectory, { recursive: true });
          writeFileSync(`${outputDirectory}/index.html`, html);
        }
      },
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
