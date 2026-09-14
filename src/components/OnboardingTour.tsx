import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trackEvent } from "@/lib/analytics";

interface Step {
  title: string;
  description: string;
  target?: string;
}

const steps: Step[] = [
  {
    title: "Bem-vindo ao Cripto Dashboard! 👋",
    description: "Vamos fazer um tour rápido pelas principais funcionalidades da plataforma."
  },
  {
    title: "Busca Global 🔍",
    description: "Use Ctrl+K (ou Cmd+K no Mac) para abrir a busca rápida e encontrar qualquer criptomoeda ou recurso.",
    target: "global-search"
  },
  {
    title: "Favoritos ⭐",
    description: "Clique no ícone de coração para adicionar criptomoedas aos seus favoritos e acompanhá-las facilmente.",
    target: "favorites"
  },
  {
    title: "Portfolio 💼",
    description: "Gerencie seus investimentos, adicione ativos e acompanhe lucros e perdas em tempo real.",
    target: "portfolio"
  },
  {
    title: "Alertas 🔔",
    description: "Configure alertas de preço personalizados e seja notificado quando suas metas forem atingidas.",
    target: "alerts"
  },
  {
    title: "Pull to Refresh 📱",
    description: "Em dispositivos móveis, arraste para baixo para atualizar os dados rapidamente.",
    target: "mobile"
  }
];

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenTour) {
      setTimeout(() => {
        setIsOpen(true);
        trackEvent("tutorial_begin", { tutorial_name: "dashboard_onboarding" });
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
    if (currentStep === steps.length - 1) {
      trackEvent("tutorial_complete", { tutorial_name: "dashboard_onboarding" });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <aside
      aria-label="Introdução ao Cripto Dashboard"
      className="fixed inset-x-3 bottom-20 z-50 animate-fade-in-up md:inset-x-auto md:bottom-6 md:right-6 md:w-full md:max-w-md"
    >
      <Card className="adrock-panel border-primary/20 shadow-xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleClose}
            aria-label="Fechar tour"
          >
            <X className="h-4 w-4" />
          </Button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Etapa {currentStep + 1} de {steps.length}</p>
          <CardTitle className="mt-1">{step.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{step.description}</p>
          <div className="mt-6 flex gap-1" role="group" aria-label={`Etapa ${currentStep + 1} de ${steps.length}`}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Pular
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                'Começar'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </aside>
  );
};
