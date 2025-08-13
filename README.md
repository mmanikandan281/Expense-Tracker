# Personal Expense Tracker (India)

A full-featured personal expense tracker built with React, TypeScript, and Supabase, optimized for Indian users. Track your income and expenses in Indian Rupees (₹) with beautiful charts, filtering, and real-time insights.

# Output
<img width="1920" height="1080" alt="Screenshot (131)" src="https://github.com/user-attachments/assets/77a18afe-d38c-4dfa-b219-3b06956e5a65" />


## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Expense Management**: Add, view, and delete income/expense transactions
- **Visual Dashboard**: Interactive charts showing expense categories and monthly trends
- **Smart Filtering**: Filter transactions by category, month, and type
- **Real-time Updates**: Instant synchronization across all devices
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Charts**: Chart.js with react-chartjs-2
- **Routing**: React Router v6
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account

### Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Click the "Connect to Supabase" button in the top right of this interface
   - Or manually create a Supabase project and get your URL and anon key

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key

4. **Set up the database:**
   - The migration file in `/supabase/migrations/` will create the expenses table
   - Supabase will automatically run this migration

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - Create an account and start tracking your expenses!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard with charts
│   ├── ExpenseForm.tsx  # Form to add new transactions
│   ├── ExpenseList.tsx  # List of transactions
│   ├── Layout.tsx       # App layout wrapper
│   └── ProtectedRoute.tsx # Route protection
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── lib/                 # Utilities and configurations
│   └── supabase.ts      # Supabase client setup
├── pages/               # Page components
│   ├── DashboardPage.tsx # Main app page
│   ├── Login.tsx         # Login page
│   └── Signup.tsx        # Registration page
└── App.tsx              # Main app component
```

## Usage

1. **Sign up** for a new account or **log in** to existing account
2. **Add transactions** using the expense form (income or expense)
3. **View your dashboard** with balance overview and visual charts
4. **Filter transactions** by category, month, or type
5. **Delete transactions** by clicking the trash icon
6. **Monitor trends** with monthly income/expense charts

## Features in Detail

### Dashboard Analytics
- Total balance calculation in Indian Rupees (₹)
- Category-wise expense breakdown (doughnut chart)
- Monthly trend analysis (line chart)
- Quick summary cards with Indian currency formatting

### Transaction Management
- Add income or expense transactions in Indian Rupees (₹)
- Categorize with predefined categories
- Set custom dates and descriptions
- Edit transaction details (coming soon)

### Smart Filtering
- Filter by specific categories
- View transactions by month/year
- Separate income from expenses
- Clear all filters with one click

## Database Schema

### Expenses Table
- `id`: Unique identifier (UUID)
- `user_id`: Foreign key to authenticated user
- `amount`: Transaction amount (decimal)
- `category`: Expense category (text)
- `type`: Transaction type ('Income' or 'Expense')
- `date`: Transaction date
- `description`: Transaction description
- `created_at`: Record creation timestamp

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- JWT authentication with secure token storage
- Environment variables for sensitive configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
