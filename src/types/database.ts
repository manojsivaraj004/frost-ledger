// Auto-generated database types for Frost Ledger
export type CategoryType = 'income' | 'expense'
export type AccountType = 'checking' | 'savings' | 'cash' | 'credit'
export type TransactionType = 'income' | 'expense' | 'transfer'
export type BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly'
export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
export type BackupType = 'auto' | 'manual'
export type BackupStatus = 'pending' | 'completed' | 'failed'
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'mobile_payment' | 'other'

export interface Category { id: string; user_id: string; name: string; type: CategoryType; color: string; icon: string; sort_order: number; created_at: string; updated_at: string }
export interface Account { id: string; user_id: string; name: string; type: AccountType; balance: number; institution: string | null; account_number: string | null; created_at: string; updated_at: string }
export interface Transaction {
  id: string; user_id: string; account_id: string | null; category_id: string | null;
  amount: number; description: string; type: TransactionType; date: string; notes: string | null;
  subcategory: string | null; payment_method: PaymentMethod | null;
  created_at: string; updated_at: string;
  category?: Category | null; account?: Account | null;
}
export interface Budget { id: string; user_id: string; category_id: string; allocated: number; spent: number; period: BudgetPeriod; start_date: string; end_date: string | null; created_at: string; updated_at: string; category?: Category | null }
export interface RecurringTransaction { id: string; user_id: string; account_id: string | null; category_id: string | null; amount: number; description: string; type: 'income' | 'expense'; frequency: RecurringFrequency; next_date: string; active: boolean; created_at: string; updated_at: string; category?: Category | null; account?: Account | null }
export interface SavingsGoal { id: string; user_id: string; name: string; target_amount: number; current_amount: number; deadline: string | null; created_at: string; updated_at: string }
export interface UserSettings { id: string; user_id: string; currency: string; date_format: string; language: string; theme: string; accent_color: string; density: string; notifications: { budget_alerts: boolean; recurring_reminders: boolean; goal_milestones: boolean }; created_at: string; updated_at: string }
export interface BackupHistory { id: string; user_id: string; filename: string; size_bytes: number; type: BackupType; status: BackupStatus; created_at: string }

export interface Database {
  public: {
    Tables: {
      categories: { Row: Category; Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>> }
      accounts: { Row: Account; Insert: Omit<Account, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Account, 'id' | 'created_at' | 'updated_at'>> }
      transactions: { Row: Transaction; Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'category' | 'account'>; Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'category' | 'account'>> }
      budgets: { Row: Budget; Insert: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'category'>; Update: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'category'>> }
      recurring_transactions: { Row: RecurringTransaction; Insert: Omit<RecurringTransaction, 'id' | 'created_at' | 'updated_at' | 'category' | 'account'>; Update: Partial<Omit<RecurringTransaction, 'id' | 'created_at' | 'updated_at' | 'category' | 'account'>> }
      savings_goals: { Row: SavingsGoal; Insert: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>> }
      user_settings: { Row: UserSettings; Insert: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>> }
      backup_history: { Row: BackupHistory; Insert: Omit<BackupHistory, 'id' | 'created_at'>; Update: Partial<Omit<BackupHistory, 'id' | 'created_at'>> }
    }
  }
}