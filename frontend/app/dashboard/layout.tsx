"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-bg-base">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border-divider flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border-divider flex items-center justify-center">
          <img src="/logo.png" alt="HR Support" className="h-8" />
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="block px-4 py-2 rounded bg-primary/10 text-primary font-semibold">
                Anagrafica
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-bg-base border-b border-border-divider flex items-center justify-between px-6">
          <div className="font-semibold text-lg text-primary">Area HR GEST</div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-muted">Utente Connesso</span>
            <button onClick={handleLogout} className="text-sm text-danger hover:underline">
              Esci
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-surface/30">
          {children}
        </main>
      </div>
    </div>
  );
}
