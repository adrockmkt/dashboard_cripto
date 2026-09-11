import { PublicLayout } from "@/components/public/PublicLayout";

export function ContactPage() {
  return (
    <PublicLayout title="Contato" updatedAt="11 de setembro de 2026">
      <p>Ad Rock Digital Mkt</p>
      <p>CNPJ: 12.520.651/0001-91</p>
      <p>
        E-mail: <a className="font-medium text-primary underline underline-offset-4" href="mailto:contato@adrock.com.br">contato@adrock.com.br</a>
      </p>
    </PublicLayout>
  );
}
