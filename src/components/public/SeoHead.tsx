import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPublicRoute } from "@/routes/public";
import { buildPageMeta, type PageMeta } from "@/lib/seo";

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  const element = document.head.querySelector<HTMLMetaElement>(selector) ?? document.createElement("meta");

  if (!element.parentNode) {
    if (property) element.setAttribute("property", name);
    else element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(href: string) {
  const element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
  element.setAttribute("rel", "canonical");
  element.setAttribute("href", href);
  if (!element.parentNode) document.head.appendChild(element);
}

export function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageMeta: PageMeta = getPublicRoute(pathname)?.meta ?? buildPageMeta({
      path: pathname,
      title: "Dashboard de criptomoedas",
      description: "Ferramenta gratuita da Ad Rock para acompanhar criptomoedas, dados de mercado, indicadores e contexto de risco.",
    });

    document.title = pageMeta.title;
    setMeta("description", pageMeta.description);
    setMeta("robots", pageMeta.robots);
    setMeta("og:title", pageMeta.title, true);
    setMeta("og:description", pageMeta.description, true);
    setMeta("og:image", pageMeta.ogImage, true);
    setMeta("og:url", pageMeta.canonical, true);
    setCanonical(pageMeta.canonical);
  }, [pathname]);

  return null;
}
