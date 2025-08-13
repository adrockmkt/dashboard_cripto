-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity REAL NOT NULL,
  avg_price REAL NOT NULL,
  current_price REAL NOT NULL,
  total_value REAL NOT NULL,
  pnl REAL NOT NULL,
  pnl_percentage REAL NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'error', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations)
CREATE POLICY "Allow all on portfolio" ON portfolio FOR ALL USING (true);
CREATE POLICY "Allow all on notifications" ON notifications FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_symbol ON portfolio(symbol);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);