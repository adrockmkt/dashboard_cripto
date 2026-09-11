import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function TradingControlsSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Indicadores e alertas
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto lg:hidden">
        <SheetHeader>
          <SheetTitle>Indicadores e alertas</SheetTitle>
          <SheetDescription>Personalize os recursos auxiliares sem tirar o gráfico da primeira dobra.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
