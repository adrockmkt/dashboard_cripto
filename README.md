# 🚀 Dashboard Cripto Avançado

Dashboard profissional para análise de criptomoedas com indicadores técnicos em tempo real, desenvolvido por **Rafael Marques Lins** da **Ad Rock Digital Mkt**.


## 📊 Funcionalidades

- ✅ **Análise técnica em tempo real** - RSI, Momentum, SMA, Bollinger Bands
- ✅ **Top 20 criptomoedas** com indicadores técnicos
- ✅ **Fear & Greed Index** atualizado automaticamente
- ✅ **Dominância do Bitcoin** e market cap total
- ✅ **Alertas dinâmicos** baseados em indicadores
- ✅ **Gráficos avançados** interativos
- ✅ **Interface responsiva** e moderna

## 🔮 Melhorias Futuras Planejadas

### 1. Sistema de Alertas Avançado
- Alertas personalizados por usuário
- Notificações push/email
- Sistema de stop-loss/take-profit

### 2. Análises Técnicas Avançadas
- Padrões candlestick (Doji, Hammer, etc.)
- Ondas de Elliott
- Indicadores Ichimoku Cloud
- Volume Profile

### 3. Portfolio Management
- Tracking de carteira real
- Cálculo de P&L (profit & loss)
- Gráficos de alocação de ativos
- Comparação de performance com benchmarks

### 4. Funcionalidades Premium
- Alternância entre tema claro/escuro
- Exportação para PDF/Excel
- Backtesting histórico
- Análise de correlação entre ativos

### 5. Melhorias de UX/UI
- Navegação via sidebar
- Skeletons de carregamento
- Toast notifications
- Customização do layout via drag & drop

### 6. Dados em Tempo Real
- Conexões via WebSocket
- Streaming de preços
- Visualização de order book
- Gráficos de profundidade de mercado

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)

### Passo a passo

1. **Clone ou baixe o projeto**
   ```bash
   # Se você tem acesso ao repositório Git
   git clone [URL_DO_REPOSITORIO]
   cd cripto_dashboard
   
   # OU baixe o ZIP e extraia
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse o dashboard**
   - Abra seu navegador
   - Acesse: `http://localhost:5173`
   - O dashboard estará rodando localmente! 🎉

### Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa verificação de código

## 🔧 Configuração

O projeto funciona sem configuração adicional! As APIs utilizadas são públicas:
- **CoinCap API** - Para dados de criptomoedas
- **Alternative.me API** - Para Fear & Greed Index

## 🚀 Deploy em produção

Para fazer deploy:

1. **Gere o build**
   ```bash
   npm run build
   ```

2. **Faça upload da pasta `dist/`** para seu servidor web

3. **Configure servidor** para servir arquivos estáticos e SPA

### 🚀 Deploy com PM2 (produção)

1. Gere o build:
   ```bash
   npm run build
   ```

2. Suba os arquivos da pasta `dist/` para o servidor

3. No servidor, execute:
   ```bash
   pm2 start npx --name cripto-frontend -- serve -s /home/adrock/cripto-dashboard -l 5173
   pm2 save
   pm2 startup
   ```

O projeto estará acessível em `http://[IP_DO_SERVIDOR]:5173`

## 📱 Tecnologias utilizadas

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderno
- **Tailwind CSS** - Framework CSS
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Recharts** - Gráficos interativos
- **React Query** - Gerenciamento de estado

## 📞 Contato

**Rafael Marques Lins**  
Ad Rock Digital Mkt

- 📱 WhatsApp: [+55 41 99125-5859](https://wa.me/5541991255859)
- 📧 Email: [rafael@adrock.com.br](mailto:rafael@adrock.com.br)

---

💚 **Nós amamos cripto!** 🚀