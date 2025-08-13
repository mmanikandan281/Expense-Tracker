import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Calendar, Tag, FileText, IndianRupee } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (expense: {
    amount: number;
    category: string;
    type: 'Income' | 'Expense';
    date: string;
    description: string;
  }) => Promise<void>;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Rent & EMI',
  'Petrol & Fuel',
  'Grocery',
  'Other',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'Expense' as 'Income' | 'Expense',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) return;

    setLoading(true);
    try {
      await onSubmit({
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        date: formData.date,
        description: formData.description,
      });
      
      setFormData({
        amount: '',
        category: '',
        type: 'Expense',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
            <Plus className="h-4 w-4 text-accent-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add New Transaction</h2>
            <p className="text-sm text-gray-600">Track your income and expenses</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Transaction Type and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-accent-600" />
                <span>Transaction Type</span>
              </div>
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Income' | 'Expense' })}
                className="form-select pl-10"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {formData.type === 'Income' ? (
                  <TrendingUp className="h-4 w-4 text-success-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger-600" />
                )}
              </div>
            </div>
          </div>
          
          <div>
            <label className="form-label">
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-accent-600" />
                <span>Amount (₹)</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="form-input pl-10"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">₹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-accent-600" />
                <span>Category</span>
              </div>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select pl-10"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="form-label">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-accent-600" />
                <span>Date</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="form-input pl-10"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="form-label">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-accent-600" />
              <span>Description</span>
            </div>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input pl-10"
              placeholder="Enter transaction description"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
            loading
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'btn-primary'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding Transaction...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};