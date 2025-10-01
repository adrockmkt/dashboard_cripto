import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Dashboard',
        portfolio: 'Portfolio',
        trading: 'Trading Pro',
        alerts: 'Alerts',
        analysis: 'Analysis',
        news: 'News'
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
      nav: {
        dashboard: 'Dashboard',
        portfolio: 'Portfólio',
        trading: 'Trading Pro',
        alerts: 'Alertas',
        analysis: 'Análise',
        news: 'Notícias'
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
      nav: {
        dashboard: 'Panel',
        portfolio: 'Portafolio',
        trading: 'Trading Pro',
        alerts: 'Alertas',
        analysis: 'Análisis',
        news: 'Noticias'
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
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
