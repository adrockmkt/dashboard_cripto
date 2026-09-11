import { PublicLayout } from "@/components/public/PublicLayout";

export function MethodologyPage() {
  return (
    <PublicLayout title="Metodologia e fontes" updatedAt="11 de setembro de 2026">
      <p>
        O dashboard consolida dados de mercado e rede de provedores públicos e integrações configuradas no
        produto. Quando uma fonte não está disponível, a interface identifica o uso de fallback ou simulação.
      </p>
      <p>
        Indicadores, gráficos e simulações são recursos informativos. Valores podem atrasar, conter erros de
        terceiros ou não refletir liquidez, taxas e condições reais de execução.
      </p>
    </PublicLayout>
  );
}
