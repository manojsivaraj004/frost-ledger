-- ============================================================================
-- Migration 01: Add subcategory and payment_method to transactions
-- Run this in the Supabase SQL Editor AFTER running schema.sql
-- Only needed if you already ran the previous schema without these columns.
-- ============================================================================

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS subcategory TEXT;

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash'
  CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'mobile_payment', 'other'));

CREATE INDEX IF NOT EXISTS idx_transactions_payment_method
  ON public.transactions(payment_method);
