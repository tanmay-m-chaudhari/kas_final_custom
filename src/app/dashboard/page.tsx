"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getTransactions } from "@/lib/storage";
import { getSession, setLastRoute } from "@/lib/cookies";
import {
  filterByCurrentMonth, getTotalIncome, getTotalExpenses,
  getExpensesByCategory, getMonthlyTrend, formatCurrency,
} from "@/lib/utils";
import { Transaction } from "@/types/finance";
import Link from "next/link";

const COLORS = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#ec4899","#14b8a6","#f97316"];

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/settings"); return; }
    setLastRoute("/dashboard");
    const txs = getTransactions();
    setTransactions(txs);
    const prefs = JSON.parse(localStorage.getItem("ft_preferences") || "{}");
    if (prefs.currency) setCurrency(prefs.currency);
  }, [router]);

  const monthly = filterByCurrentMonth(transactions);
  const totalIncome = getTotalIncome(monthly);
  const totalExpenses = getTotalExpenses(monthly);
  const net = totalIncome - totalExpenses;
  const categoryData = getExpensesByCategory(monthly);
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const trendData = getMonthlyTrend(transactions).slice(-6);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/transactions" className="text-indigo-600 hover:underline">Transactions</Link>
          <Link href="/budgets" className="text-indigo-600 hover:underline">Budgets</Link>
          <Link href="/settings" className="text-indigo-600 hover:underline">Settings</Link>
        </nav>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Income (this month)", value: formatCurrency(totalIncome, currency), color: "text-green-600" },
          { label: "Expenses (this month)", value: formatCurrency(totalExpenses, currency), color: "text-red-500" },
          { label: "Net Balance", value: formatCurrency(net, currency), color: net >= 0 ? "text-green-600" : "text-red-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Expenses by Category</h2>
          {pieData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No expenses this month</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">6-Month Trend</h2>
          {trendData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-600">Recent Transactions</h2>
          <Link href="/transactions" className="text-xs text-indigo-600 hover:underline">View all</Link>
        </div>
        {transactions.slice(0, 5).length === 0 ? (
          <p className="text-gray-400 text-sm">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {transactions.slice(0, 5).map((tx) => (
              <li key={tx.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.title}</p>
                  <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
                </div>
                <span className={`text-sm font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
