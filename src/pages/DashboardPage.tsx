import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Dashboard } from '../components/Dashboard';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Database } from '../lib/supabase';
import { Filter } from 'lucide-react';

type Expense = Database['public']['Tables']['expenses']['Row'];

export const DashboardPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    month: '',
    type: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    if (filters.month) {
      filtered = filtered.filter(expense => 
        expense.date.substring(0, 7) === filters.month
      );
    }

    if (filters.type) {
      filtered = filtered.filter(expense => expense.type === filters.type);
    }

    setFilteredExpenses(filtered);
  };

  const addExpense = async (expenseData: {
    amount: number;
    category: string;
    type: 'Income' | 'Expense';
    date: string;
    description: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          user_id: user!.id,
        })
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  const categories = [...new Set(expenses.map(e => e.category))];
  const months = [...new Set(expenses.map(e => e.date.substring(0, 7)))].sort().reverse();

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Dashboard Overview */}
        <div>
          <Dashboard expenses={expenses} />
        </div>

        {/* Add Expense Form */}
        <div data-section="transaction-form" className="scroll-mt-8">
          <ExpenseForm onSubmit={addExpense} />
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            {(filters.category || filters.month || filters.type) && (
              <button
                onClick={() => setFilters({ category: '', month: '', type: '' })}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Months</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {new Date(month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
      </div>
    </Layout>
  );
};