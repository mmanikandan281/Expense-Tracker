import React from 'react';
import { Trash2, Calendar, Tag, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { Database } from '../lib/supabase';
import { formatCurrency } from '../lib/currency';

type Expense = Database['public']['Tables']['expenses']['Row'];

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-orange-50 text-orange-700 border-orange-200',
      'Transportation': 'bg-accent-50 text-accent-700 border-accent-200',
      'Shopping': 'bg-purple-50 text-purple-700 border-purple-200',
      'Entertainment': 'bg-pink-50 text-pink-700 border-pink-200',
      'Bills & Utilities': 'bg-gray-50 text-gray-700 border-gray-200',
      'Healthcare': 'bg-danger-50 text-danger-700 border-danger-200',
      'Travel': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Education': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Salary': 'bg-success-50 text-success-700 border-success-200',
      'Freelance': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Investment': 'bg-warning-50 text-warning-700 border-warning-200',
      'Rent & EMI': 'bg-slate-50 text-slate-700 border-slate-200',
      'Petrol & Fuel': 'bg-amber-50 text-amber-700 border-amber-200',
      'Grocery': 'bg-lime-50 text-lime-700 border-lime-200',
      'Other': 'bg-neutral-50 text-neutral-700 border-neutral-200',
    };
    return colors[category] || colors['Other'];
  };

  if (expenses.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Start tracking your finances by adding your first income or expense transaction above.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">
              {expenses.length} transaction{expenses.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
            <span className="text-sm text-gray-500">Live Data</span>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="divide-y divide-gray-200">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    expense.type === 'Income' 
                      ? 'bg-success-100' 
                      : 'bg-danger-100'
                  }`}>
                    {expense.type === 'Income' ? (
                      <TrendingUp className="h-4 w-4 text-success-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-danger-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {expense.description}
                      </h3>
                      <span
                        className={`font-semibold ${
                          expense.type === 'Income' ? 'text-success-600' : 'text-danger-600'
                        }`}
                      >
                        {expense.type === 'Income' ? '+' : '-'}{formatCurrency(expense.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {/* Category */}
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 ml-3">
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded transition-colors duration-200"
                  title="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <div className="text-center text-sm text-gray-500">
          <p>Showing {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
};