# Frost Ledger — Supabase Database Setup

## Quick Start

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** → **New Query**
3. Copy and paste the entire contents of `schema.sql`
4. Click **Run**

This will create all 8 tables, enable Row Level Security, add policies, and set up triggers for auto-creating user settings and default categories on signup.

## Tables

| Table | Description |
|---|---|
| `categories` | Income/expense categories with color and icon |
| `accounts` | Financial accounts (checking, savings, cash, credit) |
| `transactions` | Individual income/expense/transfer records |
| `budgets` | Spending limits per category per period |
| `recurring_transactions` | Scheduled repeating transactions |
| `savings_goals` | Target savings with deadlines |
| `user_settings` | Per-user preferences (currency, theme, notifications) |
| `backup_history` | Backup archive records |

## Schema Relationships

```
auth.users (Supabase Auth)
  ├── categories (user_id FK)
  │     └── budgets (category_id FK)
  ├── accounts (user_id FK)
  ├── transactions (user_id FK, account_id FK, category_id FK)
  ├── recurring_transactions (user_id FK, account_id FK, category_id FK)
  ├── savings_goals (user_id FK)
  ├── user_settings (user_id FK, 1:1)
  └── backup_history (user_id FK)
```

## Row Level Security

All tables have RLS enabled. Each table has 4 policies (SELECT, INSERT, UPDATE, DELETE) that restrict access to rows where `auth.uid() = user_id`. Users can only ever read or modify their own data.

## Auto-Triggers

- **`handle_new_user`** — Fires on signup, creates a `user_settings` row for the new user
- **`seed_default_categories`** — Fires on signup, inserts 7 default categories (Food, Utilities, Maintenance, Medical, Transport, Reserves, Income)

## TypeScript Types

Database types are defined in `src/types/database.ts`. Import them in your components:

```typescript
import type { Transaction, Account, Category } from '../types/database'
```
