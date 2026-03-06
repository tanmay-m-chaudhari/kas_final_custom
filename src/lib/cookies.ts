import Cookies from "js-cookie";

const SESSION_KEY = "ft_session";
const LAST_ROUTE_KEY = "ft_last_route";
const PIN_VERIFIED_KEY = "ft_pin_verified";

export interface SessionData {
  name: string;
  startedAt: string;
}

export function setSession(data: SessionData): void {
  Cookies.set(SESSION_KEY, JSON.stringify(data), { expires: 7, sameSite: "strict" });
}

export function getSession(): SessionData | null {
  const raw = Cookies.get(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  Cookies.remove(SESSION_KEY);
  Cookies.remove(PIN_VERIFIED_KEY);
}

export function setLastRoute(route: string): void {
  Cookies.set(LAST_ROUTE_KEY, route, { expires: 1 });
}

export function getLastRoute(): string {
  return Cookies.get(LAST_ROUTE_KEY) ?? "/dashboard";
}

export function setPinVerified(): void {
  Cookies.set(PIN_VERIFIED_KEY, "1", { expires: 1 });
}

export function isPinVerified(): boolean {
  return Cookies.get(PIN_VERIFIED_KEY) === "1";
}
