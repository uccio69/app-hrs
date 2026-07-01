"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // --- Forgot password state ---
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  // --- Change password state (password scaduta) ---
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changeOldPassword, setChangeOldPassword] = useState("");
  const [changeNewPassword, setChangeNewPassword] = useState("");
  const [changeConfirmPassword, setChangeConfirmPassword] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");
  const [changeUsername, setChangeUsername] = useState("");
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
  const [showChangeConfirmPassword, setShowChangeConfirmPassword] = useState(false);

  if (!mounted) return null;

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
        const errData = await res.json().catch(() => ({ detail: "Errore di connessione" }));
        throw new Error(errData.detail || "Credenziali non valide");
      }

      const data = await res.json();

      // Salva i dati utente nel localStorage
      localStorage.setItem("token", data.access_token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Controllo scadenza password
      if (data.password_expired) {
        setChangeUsername(username);
        setChangeOldPassword(password);
        setShowChangePassword(true);
        return;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore di connessione al server";
      setError(message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError("");
    setChangeSuccess("");

    if (changeNewPassword !== changeConfirmPassword) {
      setChangeError("Le due password non coincidono");
      return;
    }

    if (changeNewPassword.length < 4) {
      setChangeError("La nuova password deve essere di almeno 4 caratteri");
      return;
    }

    if (changeNewPassword === changeOldPassword) {
      setChangeError("La nuova password deve essere diversa da quella attuale");
      return;
    }

    setChangeLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: changeUsername,
          old_password: changeOldPassword,
          new_password: changeNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Errore durante il cambio password");
      }

      setChangeSuccess(data.message || "Password aggiornata con successo!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore di connessione al server";
      setChangeError(message);
    } finally {
      setChangeLoading(false);
    }
  };

  const handleBackToLoginFromChange = () => {
    setShowChangePassword(false);
    setChangeOldPassword("");
    setChangeNewPassword("");
    setChangeConfirmPassword("");
    setChangeError("");
    setChangeSuccess("");
    setPassword("");
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore di connessione al server";
      setForgotError(message);
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

  // =========================================================================
  // RENDER
  // =========================================================================

  // --- Vista: Cambio Password (password scaduta) ---
  if (showChangePassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="w-full max-w-md rounded-lg bg-bg-base p-8 shadow-sm border border-border-divider">
          <div className="mb-8 text-center">
            <img src="/logo.png" alt="HR Support Logo" className="mx-auto mb-4 h-12" />
            <h1 className="text-2xl font-bold text-primary">Password Scaduta</h1>
            <p className="text-sm text-text-muted mt-1">
              La tua password è scaduta. Inserisci una nuova password per continuare.
            </p>
          </div>

          {changeSuccess ? (
            <div className="space-y-4">
              <div className="rounded border border-success/30 bg-success/10 p-4 text-center">
                <svg className="mx-auto mb-2 h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-success font-medium">{changeSuccess}</p>
              </div>
              <button
                type="button"
                onClick={handleBackToLoginFromChange}
                className="w-full rounded bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Torna al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-5" suppressHydrationWarning>
              <div className="rounded border border-warning/30 bg-warning/10 p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-text-main">
                    Utente: <strong>{changeUsername}</strong> — la password risulta scaduta.
                  </p>
                </div>
              </div>

              <div suppressHydrationWarning>
                <label className="mb-1 block text-sm font-semibold text-text-main" htmlFor="new-password">
                  Nuova Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showChangeNewPassword ? "text" : "password"}
                    value={changeNewPassword}
                    onChange={(e) => setChangeNewPassword(e.target.value)}
                    className="w-full rounded border border-border-divider bg-bg-base p-2 pr-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Inserisci la nuova password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangeNewPassword(!showChangeNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-main"
                  >
                    {showChangeNewPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div suppressHydrationWarning>
                <label className="mb-1 block text-sm font-semibold text-text-main" htmlFor="confirm-password">
                  Conferma Nuova Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showChangeConfirmPassword ? "text" : "password"}
                    value={changeConfirmPassword}
                    onChange={(e) => setChangeConfirmPassword(e.target.value)}
                    className="w-full rounded border border-border-divider bg-bg-base p-2 pr-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Ripeti la nuova password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangeConfirmPassword(!showChangeConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-main"
                  >
                    {showChangeConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {changeError && <p className="text-sm text-danger">{changeError}</p>}

              <button
                type="submit"
                disabled={changeLoading}
                className="w-full rounded bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {changeLoading ? "Aggiornamento in corso..." : "Aggiorna Password"}
              </button>

              <button
                type="button"
                onClick={handleBackToLoginFromChange}
                className="w-full rounded border-2 border-primary bg-transparent px-5 py-2.5 font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                Annulla
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- Vista principale: Login / Forgot Password ---
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
            <form onSubmit={handleLogin} className="space-y-6" suppressHydrationWarning>
              <div suppressHydrationWarning>
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

              <div suppressHydrationWarning>
                <label className="mb-1 block text-sm font-semibold text-text-main" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border border-border-divider bg-bg-base p-2 pr-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-main"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
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
              <form onSubmit={handleForgotPassword} className="space-y-6" suppressHydrationWarning>
                <div suppressHydrationWarning>
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
