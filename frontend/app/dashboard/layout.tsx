"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// --- SVG Icon Components ---
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconAnagrafica = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconUtilita = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const IconAttivita = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const IconCosti = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUtenti = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconWorkflow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [utilitaOpen, setUtilitaOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Leggi dati utente dal localStorage
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const nome = user.nome || "";
        const cognome = user.cognome || "";
        const livello = user.livello !== undefined && user.livello !== null ? ` (${user.livello})` : "";
        const fullName = `${nome} ${cognome}`.trim();
        setUserName((fullName || user.username || "Utente") + livello);
      }
    } catch {
      // Ignora errori di parsing
    }
  }, [router]);

  // Auto-expand Utilità submenu if we're on a child page
  useEffect(() => {
    if (pathname?.startsWith("/dashboard/utenti") ||
        pathname?.startsWith("/dashboard/attivita") ||
        pathname?.startsWith("/dashboard/costi") ||
        pathname?.startsWith("/dashboard/workflow")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUtilitaOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!mounted) return null;

  const isActive = (path: string) => pathname === path;

  const submenuItems = [
    { label: "Attività", icon: <IconAttivita />, href: "/dashboard/attivita", enabled: false },
    { label: "Costi", icon: <IconCosti />, href: "/dashboard/costi", enabled: false },
    { label: "Utenti", icon: <IconUtenti />, href: "/dashboard/utenti", enabled: true },
    { label: "Workflow", icon: <IconWorkflow />, href: "/dashboard/workflow", enabled: false },
  ];

  return (
    <div className="flex h-screen bg-bg-base">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40 inset-y-0 left-0 w-64
          bg-white border-r border-border-divider flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 px-4 border-b border-border-divider flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="HR Support" className="h-8" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {/* Dashboard Principale */}
            <li>
              <a
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-primary/10 text-primary"
                    : "text-text-main hover:bg-surface hover:text-primary"
                }`}
              >
                <IconHome />
                Dashboard Principale
              </a>
            </li>

            {/* Anagrafica */}
            <li>
              <a
                href="/dashboard/anagrafica"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard/anagrafica")
                    ? "bg-primary/10 text-primary"
                    : "text-text-main hover:bg-surface hover:text-primary"
                }`}
              >
                <IconAnagrafica />
                Anagrafica
              </a>
            </li>

            {/* Utilità (expandable) */}
            <li>
              <button
                onClick={() => setUtilitaOpen(!utilitaOpen)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  utilitaOpen
                    ? "bg-primary/5 text-primary"
                    : "text-text-main hover:bg-surface hover:text-primary"
                }`}
              >
                <span className="flex items-center gap-3">
                  <IconUtilita />
                  Utilità
                </span>
                <IconChevron open={utilitaOpen} />
              </button>

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  utilitaOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="ml-4 pl-4 border-l-2 border-border-divider space-y-0.5">
                  {submenuItems.map((item) => (
                    <li key={item.label}>
                      {item.enabled ? (
                        <a
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(item.href)
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-text-main hover:bg-surface hover:text-primary"
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </a>
                      ) : (
                        <span className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-muted/50 cursor-not-allowed">
                          {item.icon}
                          {item.label}
                          <span className="ml-auto text-[10px] uppercase tracking-wide bg-surface text-text-muted/60 px-1.5 py-0.5 rounded">
                            soon
                          </span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-border-divider shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <IconLogout />
            Esci
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-bg-base border-b border-border-divider flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-text-main"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="font-semibold text-lg text-primary">Area HR GEST</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-text-main">Utente: <strong>{userName}</strong></span>
            </div>
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
