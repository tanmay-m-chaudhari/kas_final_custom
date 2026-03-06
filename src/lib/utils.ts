import { Transaction, TransactionCategory } from "@/types/finance";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM dd, yyyy");
}

export function getCurrentMonthKey(): string {
  return format(new Date(), "yyyy-MM");
}

export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return { start: startOfMonth(now), end: endOfMonth(now) };
}

export function filterByCurrentMonth(transactions: Transaction[]): Transaction[] {
  const { start, end } = getCurrentMonthRange();
  return transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start, end });
  });
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getExpensesByCategory(
  transactions: Transaction[]
): Record<TransactionCategory, number> {
  const result = {} as Record<TransactionCategory, number>;
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      result[t.category] = (result[t.category] ?? 0) + t.amount;
    });
  return result;
}

export function getMonthlyTrend(
  transactions: Transaction[]
): { month: string; income: number; expense: number }[] {
  const map: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const key = t.date.slice(0, 7);
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, vals]) => ({ month, ...vals }));
}
