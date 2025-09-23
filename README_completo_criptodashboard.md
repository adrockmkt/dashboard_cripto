# 🚀 Dashboard Cripto Avançado

Dashboard profissional para análise de criptomoedas com indicadores técnicos em tempo real, desenvolvido por **Rafael Marques Lins** da **Ad Rock Digital Mkt**.

## 📊 Funcionalidades Implementadas

### 🎯 **Core Features**
- ✅ **Dashboard Principal** - Interface moderna e responsiva com dados em tempo real
- ✅ **Top 20 Criptomoedas** - Lista atualizada com preços e variações 24h
- ✅ **Análise Técnica Avançada** - RSI, Momentum, SMA, Bollinger Bands
- ✅ **Fear & Greed Index** - Indicador de sentimento do mercado atualizado automaticamente
- ✅ **Dominância do Bitcoin** - Percentual de dominância e market cap total
- ✅ **Gráficos Interativos** - Charts avançados com TradingView widgets

### 💫 **Sistema de Favoritos**
- ✅ **Persistência no Supabase** - Favoritos salvos no banco de dados
- ✅ **Sincronização em Tempo Real** - Atualizações instantâneas
- ✅ **Interface Intuitiva** - Toggle de favoritos com ícone de coração
- ✅ **Dashboard de Favoritos** - Seção dedicada para moedas favoritas

### 🚨 **Sistema de Alertas Customizados**
- ✅ **Alertas de Preço** - Definir alertas para preços específicos
- ✅ **Alertas de Variação** - Monitorar mudanças percentuais
- ✅ **Persistência no Banco** - Todos os alertas salvos no Supabase
- ✅ **Status de Ativação** - Ativar/desativar alertas individualmente
- ✅ **Notificações em Tempo Real** - Alertas disparados automaticamente

### 📰 **Feed de Notícias**
- ✅ **Notícias do Mercado Cripto** - Feed atualizado com últimas notícias
- ✅ **Categorização** - Notícias organizadas por categorias
- ✅ **Timestamps** - Data e hora de publicação
- ✅ **Links Externos** - Acesso direto às fontes das notícias

### 📊 **Gerenciador de Portfólio**
- ✅ **Tracking de Assets** - Acompanhamento de investimentos
- ✅ **Cálculo de P&L** - Profit & Loss em tempo real
- ✅ **Distribuição de Ativos** - Visualização da alocação do portfólio
- ✅ **Performance Analytics** - Métricas detalhadas de performance

### 🔔 **Centro de Notificações**
- ✅ **Alertas em Tempo Real** - Sistema de notificações ativo
- ✅ **Indicadores Técnicos** - Resumo dos principais indicadores
- ✅ **Controle de Som** - Ativação/desativação de alertas sonoros
- ✅ **Histórico de Alertas** - Visualização de alertas anteriores

### 🎨 **Interface e UX**
- ✅ **Design Responsivo** - Funciona perfeitamente em mobile e desktop
- ✅ **Tema Escuro/Claro** - Alternância de temas
- ✅ **Toast Notifications** - Feedback visual para ações do usuário
- ✅ **Loading States** - Skeletons durante carregamento
- ✅ **Layout Moderno** - Interface clean e profissional

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

### APIs e Serviços Utilizados
- **CoinGecko API** - Dados de criptomoedas em tempo real
- **Alternative.me API** - Fear & Greed Index
- **Supabase** - Backend para persistência de dados (favoritos e alertas)

### Configuração do Supabase
O projeto inclui integração com Supabase para armazenar:
- Favoritos do usuário
- Alertas customizados
- Configurações personalizadas

As tabelas necessárias estão definidas em `src/sql/schema.sql`

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

### 🎨 **Frontend**
- **React 18** - Framework frontend moderno
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI acessíveis e customizáveis

### 📊 **Visualização de Dados**
- **Recharts** - Gráficos interativos e responsivos
- **TradingView Widgets** - Charts profissionais de trading
- **Lucide React** - Biblioteca de ícones moderna

### 🔧 **Estado e Dados**
- **React Query (TanStack Query)** - Gerenciamento de estado server
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas TypeScript

### 💾 **Backend e Persistência**
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Banco de dados relacional (via Supabase)
- **Real-time subscriptions** - Atualizações em tempo real

### 🎯 **APIs Externas**
- **CoinGecko API** - Dados de criptomoedas
- **Alternative.me API** - Fear & Greed Index
- **WebSocket connections** - Dados em tempo real

### 🎨 **UI/UX**
- **Next Themes** - Sistema de temas (claro/escuro)
- **Sonner** - Toast notifications elegantes
- **Class Variance Authority** - Sistema de variantes CSS
- **Tailwind Merge** - Merge inteligente de classes CSS

## 📞 Contato

**Rafael Marques Lins**  
Ad Rock Digital Mkt

- 📱 WhatsApp: [+55 41 99125-5859](https://wa.me/5541991255859)
- 📧 Email: [rafael@adrock.com.br](mailto:rafael@adrock.com.br)

---

💚 **Nós amamos cripto!** 🚀
---

## 🔧 Planejamento de Melhorias

### Developer: Visão Geral da Nova Versão do Cripto Dashboard

Você é uma ferramenta de análise cripto voltada para investidores que tomam decisões com base em análise técnica, leitura gráfica de candles e dados fundamentais on-chain e de sentimento. Sua função é unir as melhores funcionalidades de plataformas consagradas, como CoinMarketCap, Glassnode, TradingView e outras, oferecendo uma experiência integrada. Sua interface principal é baseada em gráficos interativos e insights acionáveis.

#### 🧠 Funcionalidades esperadas:

1. **Gráficos de Velas com Análise Técnica Avançada (Base: TradingView)**
   - Exiba gráficos de velas personalizáveis (1min, 5min, 1h, 1d, etc.).
   - Inclua indicadores técnicos: RSI, MACD, Bollinger Bands, Médias Móveis, Fibonacci.
   - Identifique e destaque automaticamente padrões gráficos: 
     - Triângulo simétrico, ascendente e descendente
     - Fundo duplo, topo duplo
     - Martelo, Doji, Engolfo, Estrela da manhã/noite
   - Sinalize zonas de suporte/resistência automaticamente.
   - Opção de alertas sonoros/visuais para rompimento de padrões.
   - Overlay com comparativo de outros ativos (BTC x ETH, por ex.).

2. **Dados de Mercado em Tempo Real (Base: CoinMarketCap + CoinGecko)**
   - Preço atual, variação 24h, 7d, 30d
   - Volume de negociação por exchange
   - Market Cap, Supply circulante e total
   - Dominância do Bitcoin

3. **Sentimento de Mercado (Base: Crypto Fear & Greed Index + CoinGecko Social)**
   - Mostre o índice atualizado com leitura simplificada:
     - 0–25: Medo Extremo / 26–45: Medo / 46–54: Neutro / 55–75: Ganância / 76–100: Ganância Extrema
   - Adicione gráficos de evolução do índice ao longo do tempo
   - Agregue tweets, menções e buzz social via API pública do X (Twitter)

4. **Métricas On-Chain (Base: Glassnode + Bitcoin Counterflow + Mempool)**
   - Exiba dados como:
     - Endereços ativos
     - Hashrate
     - Entradas/saídas de BTC das exchanges (acúmulo ou venda)
     - Transações não confirmadas na Mempool
     - Taxa média de transação
   - Destaque eventos de acúmulo institucional ou movimentações de baleias

5. **Estratégia DCA (Base: DCA BTC)**
   - Simulador: “Se eu tivesse investido R$ X por semana desde [data]”
   - Mostre gráficos com resultado total, variação percentual, preço médio de entrada
   - Permita exportar como imagem ou CSV

6. **Modelo Stock-to-Flow (S2F)**
   - Exiba o gráfico original com previsões futuras
   - Sobreponha o preço real do BTC
   - Destaque os eventos de halving anteriores e projeções futuras

7. **Alertas e Insights Estratégicos**
   - Usuário pode configurar alertas personalizados:
     - Preço ultrapassou resistência
     - RSI abaixo de 30 (sobrevendido)
     - Saída massiva de BTC das exchanges
     - Fear & Greed < 20 ou > 80
   - Mensagens automáticas estilo “🚨 Alerta: Formou um triângulo ascendente no gráfico de 1h”

8. **Comparativo entre Tokens (Base: TradingView comparativo + CoinGecko Rank)**
   - Gráfico comparativo com 2 ou mais ativos
   - Ranking por Market Cap, ROI 30d, Volume/Market Cap Ratio

9. **Seção Educacional (Opcional, estilo Messari)**
   - Glossário com termos técnicos (Ex: RSI, Fibonacci, Bollinger)
   - Mini-aulas em texto ou vídeo sobre análise gráfica
   - Link para seu blog (https://adrock.com.br/blog)

#### 🛠️ Tecnologias sugeridas:
- Frontend: React com TradingView Widget ou Recharts
- Backend: Python/Flask ou Node.js
- Base de dados: SQLite (dev) / PostgreSQL (prod)
- APIs: CoinGecko, Glassnode, Crypto Fear & Greed Index, Mempool.space, DCA BTC JSON, Twitter/X, Binance API

#### 📈 Objetivo final:
Unificar análise gráfica, sentimento e fundamentos em uma única interface onde o investidor possa:
- Tomar decisões com base em sinais técnicos
- Entender o contexto on-chain e emocional do mercado
- Executar estratégias como DCA com simulações visuais
- Se antecipar a movimentos de mercado com alertas acionáveis
