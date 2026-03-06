export type TransactionCategory =
  | "income"
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"
  | "shopping"
  | "utilities"
  | "other";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  note?: string;
  receiptProcessed?: boolean;
}

export interface Budget {
  category: TransactionCategory;
  limit: number;
  month: string;
}

export interface UserPreferences {
  currency: string;
  theme: "light" | "dark";
  name: string;
  pinEnabled: boolean;
  pinHash?: string;
}
