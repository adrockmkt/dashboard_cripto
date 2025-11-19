import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, TrendingUp, Activity, FileText, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  title: string;
  type: 'crypto' | 'tab' | 'alert' | 'report';
  description?: string;
  icon: any;
  action: () => void;
}

interface GlobalSearchProps {
  onNavigate: (tab: string) => void;
}

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Debounce da query para otimizar performance
  const debouncedQuery = useDebounce(query, 200);

  const allSearchableItems: SearchResult[] = useMemo(() => [
    { id: "dashboard", title: "Dashboard", type: "tab", description: "Visão geral do mercado", icon: Activity, action: () => onNavigate("dashboard") },
    { id: "trading", title: "Trading Pro", type: "tab", description: "Gráficos candlestick avançados", icon: TrendingUp, action: () => onNavigate("trading") },
    { id: "onchain", title: "On-Chain", type: "tab", description: "Métricas on-chain", icon: Activity, action: () => onNavigate("onchain") },
    { id: "models", title: "Modelos", type: "tab", description: "DCA e Stock-to-Flow", icon: TrendingUp, action: () => onNavigate("models") },
    { id: "portfolio", title: "Portfolio", type: "tab", description: "Gerencie seus investimentos", icon: TrendingUp, action: () => onNavigate("portfolio") },
    { id: "charts", title: "Gráficos", type: "tab", description: "Análise técnica avançada", icon: Activity, action: () => onNavigate("charts") },
    { id: "report", title: "Relatório", type: "tab", description: "Relatório diário completo", icon: FileText, action: () => onNavigate("report") },
    { id: "alerts", title: "Alertas", type: "tab", description: "Sistema de alertas", icon: Bell, action: () => onNavigate("alerts") },
    { id: "btc", title: "Bitcoin", type: "crypto", description: "BTC - Análise e preço", icon: TrendingUp, action: () => onNavigate("trading") },
    { id: "eth", title: "Ethereum", type: "crypto", description: "ETH - Análise e preço", icon: TrendingUp, action: () => onNavigate("trading") },
  ], [onNavigate]);

  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = allSearchableItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered.slice(0, 6));
    setSelectedIndex(0);
  }, [allSearchableItems]);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
          setQuery("");
          setIsOpen(false);
        }
        break;
      case "Escape":
        setQuery("");
        setIsOpen(false);
        break;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crypto": return "bg-green-500/10 text-green-500";
      case "tab": return "bg-blue-500/10 text-blue-500";
      case "alert": return "bg-orange-500/10 text-orange-500";
      case "report": return "bg-purple-500/10 text-purple-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && results.length > 0 && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full mt-2 w-full z-50 shadow-lg max-h-96 overflow-y-auto">
            <CardContent className="p-2">
              {results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto py-3 px-3 hover:bg-muted",
                      index === selectedIndex && "bg-muted"
                    )}
                    onClick={() => {
                      result.action();
                      setQuery("");
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{result.title}</span>
                          <Badge variant="secondary" className={cn("text-xs", getTypeColor(result.type))}>
                            {result.type}
                          </Badge>
                        </div>
                        {result.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder*="Buscar"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
