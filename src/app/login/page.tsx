"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Falsches Passwort");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <a href="/" className="text-neutral-600 hover:text-neutral-400 text-sm mb-8 block transition-colors">
          &larr; Zurück
        </a>
        <h1 className="text-white text-2xl font-bold mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Anmelden"}
          </button>
        </form>
      </div>
    </main>
  );
}
