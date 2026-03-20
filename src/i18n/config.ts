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
      cards: {
        favorites: 'Favorites',
        cryptoNews: 'Crypto News',
        sourceReal: 'Real source',
        sourceFallback: 'Fallback',
        sourceSimulated: 'Simulated',
        noNews: 'No news available right now.',
        details: 'Details',
        readMore: 'Read more',
        marketCategory: 'Market',
        regulationCategory: 'Regulation',
        technologyCategory: 'Technology',
        generalCategory: 'General',
        loadingFavorites: 'Loading favorites...',
        noFavorites: 'No favorites yet',
        addFavoritesHint: 'Add your favorite cryptocurrencies by clicking the heart in the market list.',
        realtimeAlerts: 'Real-Time Alerts',
        noRealtimeAlerts: 'No active alerts at the moment. Alerts will appear automatically when market conditions are detected.',
        quickSummary: 'Quick Summary',
        attention: 'Attention',
        opportunity: 'Opportunity',
        info: 'Info',
        marketCapTotal: 'Total Market Cap',
        volume24h: '24h Volume',
        btcDominance: 'BTC Dominance',
        marketMood: 'Market Mood',
        neutral: 'Neutral',
        strong: 'Strong',
        weak: 'Weak',
        overbought: 'Overbought',
        oversold: 'Oversold',
        upper: 'Upper',
        lower: 'Lower',
        movingAverages: 'Moving Averages',
        trendBullish: 'Bullish Trend',
        trendBearish: 'Bearish Trend',
        buy: 'Buy',
        sell: 'Sell',
        marketOverview: 'Live overview based on current market data and sentiment.',
        altcoinsCap: 'Altcoins Cap'
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
      cards: {
        favorites: 'Favoritos',
        cryptoNews: 'Notícias Crypto',
        sourceReal: 'Fonte real',
        sourceFallback: 'Fallback',
        sourceSimulated: 'Simulado',
        noNews: 'Nenhuma notícia disponível no momento.',
        details: 'Detalhe',
        readMore: 'Ler mais',
        marketCategory: 'Mercado',
        regulationCategory: 'Regulação',
        technologyCategory: 'Tecnologia',
        generalCategory: 'Geral',
        loadingFavorites: 'Carregando favoritos...',
        noFavorites: 'Nenhum favorito ainda',
        addFavoritesHint: 'Adicione suas criptomoedas favoritas clicando no coração na lista de mercado.',
        realtimeAlerts: 'Alertas em Tempo Real',
        noRealtimeAlerts: 'Nenhum alerta ativo no momento. Os alertas aparecerão automaticamente quando condições do mercado forem detectadas.',
        quickSummary: 'Resumo Rápido',
        attention: 'Atenção',
        opportunity: 'Oportunidade',
        info: 'Info',
        marketCapTotal: 'Market Cap Total',
        volume24h: 'Volume 24h',
        btcDominance: 'Dominância BTC',
        marketMood: 'Humor do Mercado',
        neutral: 'Neutro',
        strong: 'Forte',
        weak: 'Fraco',
        overbought: 'Sobrecomprado',
        oversold: 'Sobrevendido',
        upper: 'Superior',
        lower: 'Inferior',
        movingAverages: 'Médias Móveis',
        trendBullish: 'Tendência Bullish',
        trendBearish: 'Tendência Bearish',
        buy: 'Compra',
        sell: 'Venda',
        marketOverview: 'Visão ao vivo baseada em dados atuais de mercado e sentimento.',
        altcoinsCap: 'Cap. Altcoins'
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
      cards: {
        favorites: 'Favoritos',
        cryptoNews: 'Noticias Crypto',
        sourceReal: 'Fuente real',
        sourceFallback: 'Fallback',
        sourceSimulated: 'Simulado',
        noNews: 'No hay noticias disponibles en este momento.',
        details: 'Detalle',
        readMore: 'Leer más',
        marketCategory: 'Mercado',
        regulationCategory: 'Regulación',
        technologyCategory: 'Tecnología',
        generalCategory: 'General',
        loadingFavorites: 'Cargando favoritos...',
        noFavorites: 'Aún no hay favoritos',
        addFavoritesHint: 'Agrega tus criptomonedas favoritas haciendo clic en el corazón de la lista de mercado.',
        realtimeAlerts: 'Alertas en Tiempo Real',
        noRealtimeAlerts: 'No hay alertas activas en este momento. Aparecerán automáticamente cuando se detecten condiciones de mercado.',
        quickSummary: 'Resumen Rápido',
        attention: 'Atención',
        opportunity: 'Oportunidad',
        info: 'Info',
        marketCapTotal: 'Cap. de Mercado Total',
        volume24h: 'Volumen 24h',
        btcDominance: 'Dominancia BTC',
        marketMood: 'Humor del Mercado',
        neutral: 'Neutro',
        strong: 'Fuerte',
        weak: 'Débil',
        overbought: 'Sobrecomprado',
        oversold: 'Sobrevendido',
        upper: 'Superior',
        lower: 'Inferior',
        movingAverages: 'Medias Móviles',
        trendBullish: 'Tendencia Alcista',
        trendBearish: 'Tendencia Bajista',
        buy: 'Compra',
        sell: 'Venta',
        marketOverview: 'Vista en vivo basada en datos actuales del mercado y sentimiento.',
        altcoinsCap: 'Cap. Altcoins'
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
