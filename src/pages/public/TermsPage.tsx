import { PublicLayout } from "@/components/public/PublicLayout";

export function TermsPage() {
  return (
    <PublicLayout title="Termos de Uso" updatedAt="11 de setembro de 2026">
      <p>
        Ao usar o Cripto Dashboard, você concorda em utilizar a ferramenta para fins lícitos e assume a
        responsabilidade por suas decisões. Informações e simulações são fornecidas no estado em que se
        encontram e podem mudar sem aviso.
      </p>
      <p>
        É proibido tentar interferir na operação do serviço, explorar vulnerabilidades, copiar conteúdo sem
        autorização ou utilizar a plataforma para atividade ilícita. Estes termos podem ser atualizados para
        refletir mudanças no produto ou na legislação aplicável.
      </p>
    </PublicLayout>
  );
}
