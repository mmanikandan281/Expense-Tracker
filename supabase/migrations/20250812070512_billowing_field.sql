/*
  # Create expenses table for Personal Expense Tracker

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `amount` (decimal, transaction amount)
      - `category` (text, expense category)
      - `type` (text, either 'Income' or 'Expense')
      - `date` (date, transaction date)
      - `description` (text, transaction description)
      - `created_at` (timestamptz, record creation time)

  2. Security
    - Enable RLS on `expenses` table
    - Add policy for authenticated users to manage their own expenses
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('Income', 'Expense')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses(date);
CREATE INDEX IF NOT EXISTS expenses_category_idx ON expenses(category);
CREATE INDEX IF NOT EXISTS expenses_type_idx ON expenses(type);