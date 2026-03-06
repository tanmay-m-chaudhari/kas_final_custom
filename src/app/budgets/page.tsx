"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBudgets, saveBudget, deleteBudget, getTransactions } from "@/lib/storage";
import { getSession, setLastRoute } from "@/lib/cookies";
import { filterByCurrentMonth, getExpensesByCategory, formatCurrency, getCurrentMonthKey } from "@/lib/utils";
import { Budget, TransactionCategory } from "@/types/finance";
import Link from "next/link";

const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "food","transport","housing","entertainment","health","shopping","utilities","other",
];

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spendingMap, setSpendingMap] = useState<Record<string, number>>({});
  const [currency, setCurrency] = useState("USD");
  const [form, setForm] = useState({ category: "food" as TransactionCategory, limit: "" });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const currentMonth = getCurrentMonthKey();

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/settings"); return; }
    setLastRoute("/budgets");
    const allBudgets = getBudgets().filter((b) => b.month === currentMonth);
    setBudgets(allBudgets);
    const txs = filterByCurrentMonth(getTransactions());
    setSpendingMap(getExpensesByCategory(txs) as Record<string, number>);
    const prefs = JSON.parse(localStorage.getItem("ft_preferences") || "{}");
    if (prefs.currency) setCurrency(prefs.currency);
  }, [router, currentMonth]);

  function handleSave() {
    if (!form.limit) return;
    const budget: Budget = { category: form.category, limit: parseFloat(form.limit), month: currentMonth };
    saveBudget(budget);
    setBudgets(getBudgets().filter((b) => b.month === currentMonth));
    setForm({ category: "food", limit: "" });
    setEditingCategory(null);
  }

  function handleDelete(category: string) {
    deleteBudget(category, currentMonth);
    setBudgets(getBudgets().filter((b) => b.month === currentMonth));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budgets — {currentMonth}</h1>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">← Dashboard</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          {editingCategory ? `Edit budget for ${editingCategory}` : "Set Budget"}
        </h2>
        <div className="flex gap-3">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TransactionCategory })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1">
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Monthly limit" value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40" />
          <button onClick={handleSave} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            Save
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {budgets.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No budgets set for this month yet.</p>
        ) : (
          budgets.map((b) => {
            const spent = spendingMap[b.category] ?? 0;
            const pct = Math.min((spent / b.limit) * 100, 100);
            const over = spent > b.limit;
            return (
              <div key={b.category} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{b.category}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${over ? "text-red-500" : "text-gray-700"}`}>
                      {formatCurrency(spent, currency)} / {formatCurrency(b.limit, currency)}
                    </span>
                    <button onClick={() => { setForm({ category: b.category, limit: String(b.limit) }); setEditingCategory(b.category); }}
                      className="text-xs text-indigo-500 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(b.category)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${over ? "bg-red-500" : "bg-indigo-500"}`}
                    style={{ width: `${pct}%` }} />
                </div>
                {over && <p className="text-xs text-red-400 mt-1">Over budget by {formatCurrency(spent - b.limit, currency)}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
