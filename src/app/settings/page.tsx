"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPreferences, savePreferences } from "@/lib/storage";
import { setSession, getSession, clearSession, getLastRoute } from "@/lib/cookies";
import { hashPin, verifyPin } from "@/lib/pin";
import { UserPreferences } from "@/types/finance";
import Link from "next/link";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"];

export default function SettingsPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<UserPreferences>({ currency: "USD", theme: "light", name: "", pinEnabled: false });
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const loaded = getPreferences();
    setPrefs(loaded);
    if (!getSession()) setIsNewUser(true);
  }, []);

  async function handleSave() {
    const updated = { ...prefs };
    if (newPin) {
      if (newPin.length < 4) { setPinError("PIN must be at least 4 digits."); return; }
      if (newPin !== confirmPin) { setPinError("PINs do not match."); return; }
      updated.pinHash = await hashPin(newPin);
      updated.pinEnabled = true;
    }
    savePreferences(updated);
    setPrefs(updated);
    setSession({ name: updated.name || "User", startedAt: new Date().toISOString() });
    setSaved(true);
    setPinError("");
    setTimeout(() => {
      setSaved(false);
      router.push(getLastRoute());
    }, 1200);
  }

  function handleLogout() {
    clearSession();
    router.replace("/settings");
    setIsNewUser(true);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{isNewUser ? "Welcome! Set Up Your Profile" : "Settings"}</h1>
        {!isNewUser && (
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">← Dashboard</Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
          <input value={prefs.name} onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
            placeholder="e.g. Alex" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
          <select value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Theme</label>
          <select value={prefs.theme} onChange={(e) => setPrefs({ ...prefs, theme: e.target.value as "light" | "dark" })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Set Access PIN (optional)</p>
          <input type="password" placeholder="New PIN (min 4 digits)" value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" />
          <input type="password" placeholder="Confirm PIN" value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          {pinError && <p className="text-xs text-red-500 mt-1">{pinError}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700">
            {saved ? "Saved!" : "Save & Continue"}
          </button>
          {!isNewUser && (
            <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50">
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
