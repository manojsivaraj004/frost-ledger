# Frost Ledger — Supabase Database Setup

## Quick Start

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** → **New Query**
3. Copy and paste the entire contents of `schema.sql`
4. Click **Run**

If you already ran the previous schema, run `migration_01_add_transaction_fields.sql` to add the new `subcategory` and `payment_method` columns.

## Tables

| Table | Description |
|---|---|
| `categories` | Income/expense categories with color and icon |
| `accounts` | Financial accounts (checking, savings, cash, credit) |
| `transactions` | Individual income/expense/transfer records with subcategory and payment_method |
| `budgets` | Spending limits per category per period |
| `recurring_transactions` | Scheduled repeating transactions |
| `savings_goals` | Target savings with deadlines |
| `user_settings` | Per-user preferences (currency, theme, notifications) |
| `backup_history` | Backup archive records |

## Row Level Security

All tables have RLS enabled. Each table has 4 policies (SELECT, INSERT, UPDATE, DELETE) that restrict access to rows where `auth.uid() = user_id`.

## Auto-Triggers

- **`handle_new_user`** — Fires on signup, creates a `user_settings` row
- **`seed_default_categories`** — Fires on signup, inserts 7 default categories
