import { Transaction, Budget, UserPreferences } from "@/types/finance";

const KEYS = {
  TRANSACTIONS: "ft_transactions",
  BUDGETS: "ft_budgets",
  PREFERENCES: "ft_preferences",
};

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.TRANSACTIONS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export function addTransaction(tx: Transaction): void {
  const existing = getTransactions();
  saveTransactions([tx, ...existing]);
}

export function deleteTransaction(id: string): void {
  const existing = getTransactions();
  saveTransactions(existing.filter((t) => t.id !== id));
}

export function updateTransaction(updated: Transaction): void {
  const existing = getTransactions();
  saveTransactions(existing.map((t) => (t.id === updated.id ? updated : t)));
}

export function getBudgets(): Budget[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.BUDGETS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Budget[];
  } catch {
    return [];
  }
}

export function saveBudget(budget: Budget): void {
  const existing = getBudgets();
  const index = existing.findIndex(
    (b) => b.category === budget.category && b.month === budget.month
  );
  if (index >= 0) {
    existing[index] = budget;
  } else {
    existing.push(budget);
  }
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(existing));
}

export function deleteBudget(category: string, month: string): void {
  const existing = getBudgets();
  localStorage.setItem(
    KEYS.BUDGETS,
    JSON.stringify(existing.filter((b) => !(b.category === category && b.month === month)))
  );
}

export function getPreferences(): UserPreferences {
  if (typeof window === "undefined")
    return { currency: "USD", theme: "light", name: "User", pinEnabled: false };
  const raw = localStorage.getItem(KEYS.PREFERENCES);
  if (!raw) return { currency: "USD", theme: "light", name: "User", pinEnabled: false };
  try {
    return JSON.parse(raw) as UserPreferences;
  } catch {
    return { currency: "USD", theme: "light", name: "User", pinEnabled: false };
  }
}

export function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
}
