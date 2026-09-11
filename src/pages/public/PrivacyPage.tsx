import { PublicLayout } from "@/components/public/PublicLayout";

export function PrivacyPage() {
  return (
    <PublicLayout title="Política de Privacidade" updatedAt="11 de setembro de 2026">
      <section>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Dados tratados</h2>
        <p>
          Para funcionar, o dashboard pode guardar no navegador preferências de tema, favoritos, alertas e
          informações de portfolio inseridas pela própria pessoa. Quando a integração opcional com Supabase
          estiver configurada, esses dados podem ser enviados à infraestrutura escolhida para persistência.
        </p>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Medição e cookies</h2>
        <p>
          A medição pelo Google Analytics 4 será usada somente após a escolha de cookies analíticos. Ela mede
          uso agregado do produto e não deve receber chaves de API, valores de portfolio, termos de busca,
          endereços de carteira, e-mails ou outros dados pessoais inseridos na ferramenta.
        </p>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Seus direitos e contato</h2>
        <p>
          Para dúvidas, solicitações relacionadas a dados ou atualização desta política, escreva para
          {" "}<a className="font-medium text-primary underline underline-offset-4" href="mailto:contato@adrock.com.br">contato@adrock.com.br</a>.
        </p>
      </section>
    </PublicLayout>
  );
}
