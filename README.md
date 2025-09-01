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