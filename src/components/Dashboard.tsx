import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Database } from '../lib/supabase';
import { formatCurrency } from '../lib/currency';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

type Expense = Database['public']['Tables']['expenses']['Row'];

interface DashboardProps {
  expenses: Expense[];
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const totalIncome = expenses
    .filter(e => e.type === 'Income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter(e => e.type === 'Expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Calculate percentage changes (mock data for now)
  const incomeChange = 12.5; // 12.5% increase
  const expenseChange = -8.2; // 8.2% decrease

  // Prepare category data for pie chart
  const categoryData = expenses
    .filter(e => e.type === 'Expense')
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#3B82F6',
          '#EF4444',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899',
          '#06B6D4',
          '#84CC16',
          '#F97316',
          '#6366F1',
          '#14B8A6',
          '#F43F5E',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
      },
    ],
  };

  // Prepare monthly trend data
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toISOString().substring(0, 7);
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (expense.type === 'Income') {
      acc[month].income += expense.amount;
    } else {
      acc[month].expenses += expense.amount;
    }
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const sortedMonths = Object.keys(monthlyData).sort();
  const lineData = {
    labels: sortedMonths.map(month => 
      new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    ),
    datasets: [
      {
        label: 'Income',
        data: sortedMonths.map(month => monthlyData[month].income),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Expenses',
        data: sortedMonths.map(month => monthlyData[month].expenses),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back! 👋</h1>
        <p className="text-gray-600">
          Track your finances and stay on top of your budget with our comprehensive expense tracker.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-success-600" />
            </div>
            <div className={`badge ${balance >= 0 ? 'badge-success' : 'badge-danger'}`}>
              {balance >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {balance >= 0 ? 'Positive' : 'Negative'}
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Balance</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {balance >= 0 ? 'Great job managing your finances!' : 'Time to review your spending habits.'}
          </p>
        </div>

        <div className="card card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-accent-600" />
            </div>
            <div className="badge badge-success">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +{incomeChange}%
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-success-600">{formatCurrency(totalIncome)}</p>
          <p className="text-sm text-gray-500 mt-2">
            {incomeChange > 0 ? 'Income is growing steadily!' : 'Consider new income sources.'}
          </p>
        </div>

        <div className="card card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-danger-600" />
            </div>
            <div className="badge badge-danger">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              {expenseChange}%
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-danger-600">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-gray-500 mt-2">
            {expenseChange < 0 ? 'Expenses are decreasing!' : 'Keep an eye on spending.'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-header">Expenses by Category</h3>
            <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
          </div>
          {Object.keys(categoryData).length > 0 ? (
            <div className="h-64 flex justify-center">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                          size: 11,
                        },
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      borderColor: '#3B82F6',
                      borderWidth: 1,
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${formatCurrency(context.parsed)}`;
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-gray-400" />
                </div>
                <p className="font-medium">No expense data available</p>
                <p className="text-sm">Start adding transactions to see your spending patterns</p>
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-header">Monthly Trend</h3>
            <div className="flex space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
          {sortedMonths.length > 0 ? (
            <div className="h-64">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      borderColor: '#3B82F6',
                      borderWidth: 1,
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value as number);
                        },
                        font: {
                          size: 10,
                        },
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                      ticks: {
                        font: {
                          size: 10,
                        },
                      }
                    },
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index' as const,
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-gray-400" />
                </div>
                <p className="font-medium">No trend data available</p>
                <p className="text-sm">Add transactions over time to see your financial trends</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};