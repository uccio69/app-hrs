"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // --- Forgot password state ---
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) {
        throw new Error("Credenziali non valide");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Errore di connessione al server");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setForgotLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: forgotUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Errore durante il recupero della password");
      }

      setForgotMessage(data.message || "Password inviata all'indirizzo email associato al tuo account.");
      setForgotUsername("");
    } catch (err: any) {
      setForgotError(err.message || "Errore di connessione al server");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgot(false);
    setForgotUsername("");
    setForgotMessage("");
    setForgotError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md rounded-lg bg-bg-base p-8 shadow-sm border border-border-divider">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="HR Support Logo"
            className="mx-auto mb-4 h-12"
          />
          <h1 className="text-2xl font-bold text-primary">
            {showForgot ? "Recupero Password" : "Accesso Riservato"}
          </h1>
          <p className="text-sm text-text-muted">
            {showForgot
              ? "Inserisci il tuo nome utente per ricevere la password via email"
              : "Inserisci le tue credenziali per accedere"}
          </p>
        </div>

        {!showForgot ? (
          <>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="mb-1 block text-sm font-semibold text-text-main" htmlFor="username">
                  Nome Utente
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded border border-border-divider bg-bg-base p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-text-main" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-border-divider bg-bg-base p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <button
                type="submit"
                className="w-full rounded bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Accedi
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors cursor-pointer"
                id="forgot-password-link"
              >
                Password dimenticata?
              </button>
            </div>
          </>
        ) : (
          <>
            {forgotMessage ? (
              <div className="space-y-4">
                <div className="rounded border border-success/30 bg-success/10 p-4 text-center">
                  <svg className="mx-auto mb-2 h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-success font-medium">{forgotMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full rounded bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors"
                  id="back-to-login-btn"
                >
                  Torna al Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-text-main" htmlFor="forgot-username">
                    Nome Utente
                  </label>
                  <input
                    id="forgot-username"
                    type="text"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    className="w-full rounded border border-border-divider bg-bg-base p-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Inserisci il tuo nome utente"
                    required
                  />
                </div>

                {forgotError && <p className="text-sm text-danger">{forgotError}</p>}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full rounded bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  id="send-password-btn"
                >
                  {forgotLoading ? "Invio in corso..." : "Invia Password via Email"}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full rounded border-2 border-primary bg-transparent px-5 py-2.5 font-semibold text-primary hover:bg-primary/5 transition-colors"
                  id="cancel-forgot-btn"
                >
                  Annulla
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
