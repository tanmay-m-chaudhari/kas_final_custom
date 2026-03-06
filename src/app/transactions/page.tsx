"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getTransactions, addTransaction, deleteTransaction } from "@/lib/storage";
import { getSession, setLastRoute } from "@/lib/cookies";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction, TransactionCategory, TransactionType } from "@/types/finance";
import Link from "next/link";

const CATEGORIES: TransactionCategory[] = [
  "income","food","transport","housing","entertainment","health","shopping","utilities","other",
];

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterCategory, setFilterCategory] = useState<"all" | TransactionCategory>("all");
  const [form, setForm] = useState({
    title: "", amount: "", type: "expense" as TransactionType,
    category: "food" as TransactionCategory, date: new Date().toISOString().slice(0, 10), note: "",
  });

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/settings"); return; }
    setLastRoute("/transactions");
    const txs = getTransactions();
    setTransactions(txs);
    const prefs = JSON.parse(localStorage.getItem("ft_preferences") || "{}");
    if (prefs.currency) setCurrency(prefs.currency);
  }, [router]);

  function handleAdd() {
    if (!form.title.trim() || !form.amount) return;
    const tx: Transaction = {
      id: uuidv4(), title: form.title.trim(),
      amount: parseFloat(form.amount), type: form.type,
      category: form.category, date: form.date,
      note: form.note || undefined,
    };
    addTransaction(tx);
    setTransactions(getTransactions());
    setShowForm(false);
    setForm({ title: "", amount: "", type: "expense", category: "food", date: new Date().toISOString().slice(0, 10), note: "" });
  }

  function handleDelete(id: string) {
    deleteTransaction(id);
    setTransactions(getTransactions());
  }

  const filtered = transactions.filter((t) => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex gap-3">
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">← Dashboard</Link>
          <button onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            + Add
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as "all" | TransactionType)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as "all" | TransactionCategory)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">New Transaction</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="Amount" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TransactionCategory })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">Save</button>
            <button onClick={() => setShowForm(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No transactions found.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map((tx) => (
              <li key={tx.id} className="flex justify-between items-center px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.title}</p>
                  <p className="text-xs text-gray-400">{tx.category} · {formatDate(tx.date)}</p>
                  {tx.note && <p className="text-xs text-gray-400 italic">{tx.note}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                  </span>
                  <button onClick={() => handleDelete(tx.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
