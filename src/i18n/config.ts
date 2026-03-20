import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const storedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('language') : null;

const browserLanguage =
  typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'pt';

const initialLanguage = storedLanguage || browserLanguage || 'pt';

const resources = {
  en: {
    translation: {
      app: {
        title: 'CryptoTracker Pro',
        retry: 'Try again',
        notFound: 'Page not found'
      },
      nav: {
        dashboard: 'Dashboard',
        portfolio: 'Portfolio',
        trading: 'Trading Pro',
        alerts: 'Alerts',
        analysis: 'Analysis',
        news: 'News',
        onchain: 'On-Chain',
        models: 'Models',
        charts: 'Charts',
        report: 'Report',
        legacy: 'Classic',
        navigation: 'Navigation',
        home: 'Home'
      },
      header: {
        onchain: 'On-Chain Metrics',
        models: 'Predictive Models',
        dca: 'DCA Simulator',
        s2f: 'Stock-to-Flow',
        report: 'Report',
        alerts: 'Alerts',
        legacy: 'Classic View'
      },
      dashboard: {
        title: 'Crypto Dashboard',
        marketCap: 'Market Cap',
        volume24h: '24h Volume',
        btcDominance: 'BTC Dominance',
        favorites: 'Favorites',
        topCryptos: 'Top Cryptocurrencies',
        news: 'Latest News',
        refresh: 'Refresh'
      },
      search: {
        placeholder: 'Search... (Ctrl+K)',
        dashboardDescription: 'Market overview',
        tradingDescription: 'Advanced candlestick charts',
        onchainDescription: 'On-chain metrics',
        modelsDescription: 'DCA and Stock-to-Flow',
        portfolioDescription: 'Manage your investments',
        chartsDescription: 'Advanced technical analysis',
        reportDescription: 'Complete daily report',
        alertsDescription: 'Alert system',
        bitcoinDescription: 'BTC - Analysis and price',
        ethereumDescription: 'ETH - Analysis and price',
        typeCrypto: 'crypto',
        typeTab: 'tab',
        typeAlert: 'alert',
        typeReport: 'report'
      },
      portfolio: {
        title: 'Portfolio',
        totalValue: 'Total Value',
        addAsset: 'Add Asset',
        profit: 'Profit/Loss',
        export: 'Export'
      },
      common: {
        price: 'Price',
        change24h: '24h Change',
        loading: 'Loading...',
        error: 'Error',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit'
      }
    }
  },
  pt: {
    translation: {
      app: {
        title: 'CryptoTracker Pro',
        retry: 'Tentar novamente',
        notFound: 'Página não encontrada'
      },
      nav: {
        dashboard: 'Dashboard',
        portfolio: 'Portfólio',
        trading: 'Trading Pro',
        alerts: 'Alertas',
        analysis: 'Análise',
        news: 'Notícias',
        onchain: 'On-Chain',
        models: 'Modelos',
        charts: 'Gráficos',
        report: 'Relatório',
        legacy: 'Clássica',
        navigation: 'Navigation',
        home: 'Home'
      },
      header: {
        onchain: 'Métricas On-Chain',
        models: 'Modelos Preditivos',
        dca: 'Simulador DCA',
        s2f: 'Stock-to-Flow',
        report: 'Relatório',
        alerts: 'Alertas',
        legacy: 'Visão Clássica'
      },
      dashboard: {
        title: 'Dashboard de Criptomoedas',
        marketCap: 'Cap. de Mercado',
        volume24h: 'Volume 24h',
        btcDominance: 'Dominância BTC',
        favorites: 'Favoritos',
        topCryptos: 'Top Criptomoedas',
        news: 'Últimas Notícias',
        refresh: 'Atualizar'
      },
      search: {
        placeholder: 'Buscar... (Ctrl+K)',
        dashboardDescription: 'Visão geral do mercado',
        tradingDescription: 'Gráficos candlestick avançados',
        onchainDescription: 'Métricas on-chain',
        modelsDescription: 'DCA e Stock-to-Flow',
        portfolioDescription: 'Gerencie seus investimentos',
        chartsDescription: 'Análise técnica avançada',
        reportDescription: 'Relatório diário completo',
        alertsDescription: 'Sistema de alertas',
        bitcoinDescription: 'BTC - Análise e preço',
        ethereumDescription: 'ETH - Análise e preço',
        typeCrypto: 'cripto',
        typeTab: 'aba',
        typeAlert: 'alerta',
        typeReport: 'relatório'
      },
      portfolio: {
        title: 'Portfólio',
        totalValue: 'Valor Total',
        addAsset: 'Adicionar Ativo',
        profit: 'Lucro/Prejuízo',
        export: 'Exportar'
      },
      common: {
        price: 'Preço',
        change24h: 'Mudança 24h',
        loading: 'Carregando...',
        error: 'Erro',
        save: 'Salvar',
        cancel: 'Cancelar',
        delete: 'Deletar',
        edit: 'Editar'
      }
    }
  },
  es: {
    translation: {
      app: {
        title: 'CryptoTracker Pro',
        retry: 'Intentar de nuevo',
        notFound: 'Página no encontrada'
      },
      nav: {
        dashboard: 'Panel',
        portfolio: 'Portafolio',
        trading: 'Trading Pro',
        alerts: 'Alertas',
        analysis: 'Análisis',
        news: 'Noticias',
        onchain: 'On-Chain',
        models: 'Modelos',
        charts: 'Gráficos',
        report: 'Informe',
        legacy: 'Clásica',
        navigation: 'Navegación',
        home: 'Inicio'
      },
      header: {
        onchain: 'Métricas On-Chain',
        models: 'Modelos Predictivos',
        dca: 'Simulador DCA',
        s2f: 'Stock-to-Flow',
        report: 'Informe',
        alerts: 'Alertas',
        legacy: 'Vista Clásica'
      },
      dashboard: {
        title: 'Panel de Criptomonedas',
        marketCap: 'Cap. de Mercado',
        volume24h: 'Volumen 24h',
        btcDominance: 'Dominancia BTC',
        favorites: 'Favoritos',
        topCryptos: 'Top Criptomonedas',
        news: 'Últimas Noticias',
        refresh: 'Actualizar'
      },
      search: {
        placeholder: 'Buscar... (Ctrl+K)',
        dashboardDescription: 'Vista general del mercado',
        tradingDescription: 'Gráficos candlestick avanzados',
        onchainDescription: 'Métricas on-chain',
        modelsDescription: 'DCA y Stock-to-Flow',
        portfolioDescription: 'Gestiona tus inversiones',
        chartsDescription: 'Análisis técnico avanzado',
        reportDescription: 'Informe diario completo',
        alertsDescription: 'Sistema de alertas',
        bitcoinDescription: 'BTC - Análisis y precio',
        ethereumDescription: 'ETH - Análisis y precio',
        typeCrypto: 'cripto',
        typeTab: 'pestaña',
        typeAlert: 'alerta',
        typeReport: 'informe'
      },
      portfolio: {
        title: 'Portafolio',
        totalValue: 'Valor Total',
        addAsset: 'Agregar Activo',
        profit: 'Ganancia/Pérdida',
        export: 'Exportar'
      },
      common: {
        price: 'Precio',
        change24h: 'Cambio 24h',
        loading: 'Cargando...',
        error: 'Error',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: ['pt', 'en', 'es'].includes(initialLanguage) ? initialLanguage : 'pt',
    fallbackLng: 'en',
    supportedLngs: ['pt', 'en', 'es'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
