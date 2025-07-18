import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, Heart } from "lucide-react";

const Footer = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5541991255859', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:rafael@adrock.com.br', '_blank');
  };

  return (
    <Card className="mt-8 border-t">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Lado Esquerdo */}
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-foreground">
              Ad Rock Digital Mkt - Dashboard Cripto Avançado
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Por Rafael Marques Lins
            </p>
          </div>

          {/* Lado Direito */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-1 mb-3">
              <span className="text-sm font-medium">Nós amamos cripto</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleWhatsAppClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-green-50 hover:border-green-500 hover:text-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              
              <Button
                onClick={handleEmailClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Footer;