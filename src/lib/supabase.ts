import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Better error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.error('Please check your .env.local file or Vercel environment variables.');
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format. Should be: https://your-project-id.supabase.co');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Test connection on client side only
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  });
}

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          category: string;
          type: 'Income' | 'Expense';
          date: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          category: string;
          type: 'Income' | 'Expense';
          date: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          category?: string;
          type?: 'Income' | 'Expense';
          date?: string;
          description?: string;
          created_at?: string;
        };
      };
    };
  };
};