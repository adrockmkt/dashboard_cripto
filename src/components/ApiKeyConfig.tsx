import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Eye, EyeOff, CheckCircle } from "lucide-react";

const ApiKeyConfig = () => {
  const [keys, setKeys] = useState({
    coingecko: '',
    coinmarketcap: ''
  });
  const [showKeys, setShowKeys] = useState({
    coingecko: false,
    coinmarketcap: false
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setKeys({ coingecko: '', coinmarketcap: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleShowKey = (keyType: 'coingecko' | 'coinmarketcap') => {
    setShowKeys(prev => ({
      ...prev,
      [keyType]: !prev[keyType]
    }));
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração de API Keys
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            As chaves informadas não são armazenadas no navegador. A integração
            segura de provedores exige uma camada de servidor antes de ativação.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coingecko-key">CoinGecko API Key</Label>
            <div className="flex gap-2">
              <Input
                id="coingecko-key"
                type={showKeys.coingecko ? "text" : "password"}
                value={keys.coingecko}
                onChange={(e) => setKeys(prev => ({ ...prev, coingecko: e.target.value }))}
                placeholder="Sua CoinGecko API Key"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => toggleShowKey('coingecko')}
              >
                {showKeys.coingecko ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Obtenha em: <a href="https://coingecko.com/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">coingecko.com/api</a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coinmarketcap-key">CoinMarketCap API Key</Label>
            <div className="flex gap-2">
              <Input
                id="coinmarketcap-key"
                type={showKeys.coinmarketcap ? "text" : "password"}
                value={keys.coinmarketcap}
                onChange={(e) => setKeys(prev => ({ ...prev, coinmarketcap: e.target.value }))}
                placeholder="Sua CoinMarketCap API Key"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => toggleShowKey('coinmarketcap')}
              >
                {showKeys.coinmarketcap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Obtenha em: <a href="https://coinmarketcap.com/api/" target="_blank" rel="noopener noreferrer" className="text-primary underline">coinmarketcap.com/api</a>
            </p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Salvo com sucesso!
            </>
          ) : (
            'Salvar Configurações'
          )}
        </Button>

        <Alert>
          <AlertDescription className="text-sm">
            <strong>Nota:</strong> Esta tela não ativa provedores nem persiste
            credenciais. Não informe chaves de API até a integração segura estar disponível.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;
