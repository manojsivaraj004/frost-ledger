-- ============================================================================
-- Frost Ledger — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Helper: updated_at trigger function
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense')),
  color       TEXT DEFAULT 'frost-accent',
  icon        TEXT DEFAULT 'Wallet',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER categories_set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 2. Accounts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accounts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'checking' CHECK (type IN ('checking', 'savings', 'cash', 'credit')),
  balance      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  institution  TEXT,
  account_number TEXT,  -- masked, e.g. "•••• 4291"
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER accounts_set_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Transactions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id   UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  category_id  UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount       NUMERIC(12, 2) NOT NULL,
  description  TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense', 'transfer')),
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER transactions_set_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);

-- ----------------------------------------------------------------------------
-- 4. Budgets
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.budgets (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id  UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  allocated    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  spent        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  period       TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date   DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE,
  end_date     DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER budgets_set_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);

-- ----------------------------------------------------------------------------
-- 5. Recurring Transactions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id   UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  category_id  UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount       NUMERIC(12, 2) NOT NULL,
  description  TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income', 'expense')),
  frequency    TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  next_date    DATE NOT NULL,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER recurring_transactions_set_updated_at
  BEFORE UPDATE ON public.recurring_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_recurring_user_id ON public.recurring_transactions(user_id);
CREATE INDEX idx_recurring_next_date ON public.recurring_transactions(next_date);

-- ----------------------------------------------------------------------------
-- 6. Savings Goals
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  target_amount   NUMERIC(12, 2) NOT NULL DEFAULT 0,
  current_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  deadline        DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER savings_goals_set_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_savings_goals_user_id ON public.savings_goals(user_id);

-- ----------------------------------------------------------------------------
-- 7. User Settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  currency      TEXT NOT NULL DEFAULT 'USD',
  date_format   TEXT NOT NULL DEFAULT 'YYYY-MM-DD',
  language      TEXT NOT NULL DEFAULT 'English',
  theme         TEXT NOT NULL DEFAULT 'frostpunk-dark',
  accent_color  TEXT NOT NULL DEFAULT 'arctic-blue',
  density       TEXT NOT NULL DEFAULT 'compact',
  notifications JSONB NOT NULL DEFAULT '{
    "budget_alerts": true,
    "recurring_reminders": true,
    "goal_milestones": false
  }'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_settings_set_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 8. Backup History
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.backup_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename    TEXT NOT NULL,
  size_bytes  BIGINT NOT NULL DEFAULT 0,
  type        TEXT NOT NULL DEFAULT 'manual' CHECK (type IN ('auto', 'manual')),
  status      TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_backup_history_user_id ON public.backup_history(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all user-owned tables
ALTER TABLE public.categories              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history         ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Policies: Categories
-- ----------------------------------------------------------------------------
CREATE POLICY "categories_select_own" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "categories_insert_own" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "categories_update_own" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "categories_delete_own" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Policies: Accounts
-- ----------------------------------------------------------------------------
CREATE POLICY "accounts_select_own" ON public.accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "accounts_insert_own" ON public.accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "accounts_update_own" ON public.accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "accounts_delete_own" ON public.accounts
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Policies: Transactions
-- ----------------------------------------------------------------------------
CREATE POLICY "transactions_select_own" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_update_own" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "transactions_delete_own" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Policies: Budgets
-- ----------------------------------------------------------------------------
CREATE POLICY "budgets_select_own" ON public.budgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "budgets_insert_own" ON public.budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "budgets_update_own" ON public.budgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "budgets_delete_own" ON public.budgets
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Policies: Recurring Transactions
-- ----------------------------------------------------------------------------
CREATE POLICY "recurring_select_own" ON public.recurring_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recurring_insert_own" ON public.recurring_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recurring_update_own" ON public.recurring_transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "recurring_delete_own" ON public.recurring_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Policies: Savings Goals
-- ----------------------------------------------------------------------------
CREATE POLICY "savings_goals_select_own" ON public.savings_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "savings_goals_insert_own" ON public.savings_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "savings_goals_update_own" ON public.savings_goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "savings_goals_delete_own" ON public.savings_goals
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Policies: User Settings
-- ----------------------------------------------------------------------------
CREATE POLICY "user_settings_select_own" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_settings_insert_own" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_settings_update_own" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_settings_delete_own" ON public.user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Policies: Backup History
-- ----------------------------------------------------------------------------
CREATE POLICY "backup_history_select_own" ON public.backup_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "backup_history_insert_own" ON public.backup_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "backup_history_update_own" ON public.backup_history
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "backup_history_delete_own" ON public.backup_history
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- AUTO-CREATE USER SETTINGS ON SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SEED DEFAULT CATEGORIES FOR NEW USERS (optional, via trigger)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.seed_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, type, color, icon, sort_order) VALUES
    (NEW.id, 'Food & Rations', 'expense', 'frost-accent', 'Wallet', 1),
    (NEW.id, 'Utilities', 'expense', 'ember', 'Flame', 2),
    (NEW.id, 'Maintenance', 'expense', 'frost-success', 'Wrench', 3),
    (NEW.id, 'Medical', 'expense', 'frost-accent', 'Plus', 4),
    (NEW.id, 'Transport', 'expense', 'frost-success', 'Truck', 5),
    (NEW.id, 'Reserves', 'expense', 'ember', 'DatabaseBackup', 6),
    (NEW.id, 'Income', 'income', 'frost-success', 'TrendingUp', 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_seed_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.seed_default_categories();
