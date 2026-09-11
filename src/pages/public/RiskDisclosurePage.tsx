import { PublicLayout } from "@/components/public/PublicLayout";

export function RiskDisclosurePage() {
  return (
    <PublicLayout title="Aviso de risco" updatedAt="11 de setembro de 2026">
      <p>
        Criptoativos são voláteis e envolvem risco de perda parcial ou total do capital. Desempenho passado,
        gráficos, indicadores, notícias e simulações não garantem resultados futuros.
      </p>
      <p>
        Este produto tem caráter exclusivamente informativo e educacional. Ele não constitui recomendação de
        investimento, oferta, solicitação, aconselhamento jurídico, contábil ou tributário.
      </p>
    </PublicLayout>
  );
}
