
-- Tabela de Portfolio (já existente)
CREATE TABLE IF NOT EXISTS portfolio (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  avg_price DECIMAL NOT NULL,
  current_price DECIMAL NOT NULL,
  total_value DECIMAL NOT NULL,
  pnl DECIMAL NOT NULL,
  pnl_percentage DECIMAL NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Notificações (já existente)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'error', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nova tabela de Favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  crypto_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  change_24h DECIMAL NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(crypto_id, user_id)
);

-- Nova tabela de Alertas Personalizados
CREATE TABLE IF NOT EXISTS custom_alerts (
  id TEXT PRIMARY KEY,
  crypto_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('price_above', 'price_below', 'change_above', 'change_below')),
  value DECIMAL NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered BOOLEAN DEFAULT FALSE,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_alerts_user_id ON custom_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_alerts_active ON custom_alerts(is_active);
