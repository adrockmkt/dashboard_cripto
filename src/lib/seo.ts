export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  robots: "index,follow" | "noindex,nofollow";
}

interface BuildPageMetaInput {
  path: string;
  title: string;
  description: string;
  robots?: PageMeta["robots"];
}

const defaultSiteUrl = "https://mobiledelivery.com.br/cripto-dashboard";

function getSiteUrl() {
  return (import.meta.env.VITE_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
}

function normalizePath(path: string) {
  if (!path || path === "/") return "";

  return path.startsWith("/") ? path.replace(/\/$/, "") : `/${path.replace(/\/$/, "")}`;
}

export function buildPageMeta({ path, title, description, robots = "index,follow" }: BuildPageMetaInput): PageMeta {
  const siteUrl = getSiteUrl();

  return {
    title: `${title} | Cripto Dashboard · Ad Rock`,
    description: description.trim(),
    canonical: `${siteUrl}${normalizePath(path)}`,
    ogImage: `${siteUrl}/og-image.svg`,
    robots,
  };
}
