import { Link } from "react-router-dom";
import adRockLogo from "@/assets/adrock-logo-320.png";
import { AdPlaceholder } from "@/components/public/AdPlaceholder";

interface PublicLayoutProps {
  title: string;
  updatedAt?: string;
  showAdPlaceholder?: boolean;
  children: React.ReactNode;
}

export function PublicLayout({ title, updatedAt, showAdPlaceholder = false, children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="container flex min-h-16 items-center justify-between gap-4 py-3">
          <Link to="/" aria-label="Página inicial do Cripto Dashboard" className="flex items-center gap-3">
            <img src={adRockLogo} alt="Ad Rock Digital Mkt" className="h-9 w-auto" />
            <span className="text-sm font-semibold">Cripto Dashboard</span>
          </Link>
          <Link
            to="/"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Abrir dashboard
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl py-10 sm:py-16">
        <article className="space-y-8">
          <header className="space-y-3">
            <p className="text-sm font-medium text-primary">Ad Rock Digital Mkt</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {updatedAt && <p className="text-sm text-muted-foreground">Atualizado em {updatedAt}</p>}
          </header>
          <div className="space-y-6 text-base leading-7 text-muted-foreground">{children}</div>
          {showAdPlaceholder && <AdPlaceholder />}
        </article>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container space-y-4 py-8 text-sm text-muted-foreground">
          <p>Ad Rock Digital Mkt · CNPJ 12.520.651/0001-91</p>
          <nav aria-label="Links institucionais" className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/privacidade">Privacidade</Link>
            <Link to="/termos">Termos</Link>
            <Link to="/politica-de-ia">Política de IA</Link>
            <Link to="/aviso-de-risco">Aviso de risco</Link>
            <Link to="/contato">Contato</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
