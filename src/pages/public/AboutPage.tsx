import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/public/PublicLayout";

export function AboutPage() {
  return (
    <PublicLayout title="Sobre a plataforma" updatedAt="11 de setembro de 2026">
      <p>
        O Cripto Dashboard é uma ferramenta da Ad Rock Digital Mkt para acompanhar dados de mercado,
        indicadores, notícias e cenários de criptoativos em uma única interface.
      </p>
      <p>
        Nosso objetivo é tornar a leitura de informações públicas de mercado mais clara. A ferramenta não
        presta consultoria financeira, não administra recursos e não recomenda compra, venda ou manutenção
        de qualquer ativo.
      </p>
      <p>
        <Link className="font-medium text-primary underline underline-offset-4" to="/">
          Abrir dashboard
        </Link>
      </p>
    </PublicLayout>
  );
}
