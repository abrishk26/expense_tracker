// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface Expense {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetGoal, setBudgetGoal] = useState<number | null>(null);
  const [totalSpending, setTotalSpending] = useState<number>(0);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', session.user.id);

      if (expensesError) {
        setError(expensesError.message);
        return;
      }

      setExpenses(expensesData || []);

      const { data: budgetData, error: budgetError } = await supabase
        .from('budget_goals')
        .select('goal_amount')
        .eq('user_id', session.user.id)
        .single();

      if (budgetError) {
        setError(budgetError.message);
        return;
      }

      setBudgetGoal(budgetData?.goal_amount || null);

      const total = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      setTotalSpending(total);
    };

    fetchData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Expense Tracker</Link>
          <button onClick={handleLogout} className="hover:text-blue-200">Logout</button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Expenses */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
            <ul className="space-y-4">
              {expenses.map((expense) => (
                <li key={expense.id} className="bg-white p-4 rounded-lg shadow-md">
                  <p>{expense.date} - {expense.description} - ${expense.amount} ({expense.category})</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p>Total Spending: ${totalSpending}</p>
              <p>Budget Goal: ${budgetGoal}</p>
              <p>Remaining Budget: ${budgetGoal ? budgetGoal - totalSpending : 'N/A'}</p>
              {budgetGoal && totalSpending > budgetGoal && (
                <p className="text-red-500">Warning: You have exceeded your budget!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}