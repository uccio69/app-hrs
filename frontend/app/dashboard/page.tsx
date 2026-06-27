"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export default function DashboardHomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // La chiamata non richiede auth in questo caso specifico, oppure possiamo passare il token
        // ma la route FastAPI non ha Depends(get_current_user) al momento.
        const res = await fetch("http://localhost:8000/api/news/lavoro");
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col h-full space-y-8 min-h-[500px]">
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold text-text-main mb-4">Benvenuto nella Dashboard</h1>
        <p className="text-text-muted text-lg">
          Seleziona una voce dal menu laterale per iniziare.
        </p>
      </div>

      <div className="flex-1 mt-8 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-text-main mb-6 border-b pb-2">
          Ultime News dal Mondo del Lavoro
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-text-muted">Caricamento notizie in corso...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">
            Impossibile caricare le notizie al momento.
          </div>
        ) : news.length === 0 ? (
          <div className="text-text-muted p-4">
            Nessuna notizia disponibile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <a 
                key={index} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-bg-base border border-border-divider rounded-lg p-5 hover:shadow-md transition-shadow hover:border-primary group flex flex-col"
              >
                <h3 className="font-semibold text-lg text-text-main group-hover:text-primary transition-colors line-clamp-3 mb-2">
                  {item.title}
                </h3>
                <div className="mt-auto pt-4 flex justify-between items-center text-sm text-text-muted">
                  <span className="truncate max-w-[150px] font-medium">{item.source || "Google News"}</span>
                  <span>{new Date(item.pubDate).toLocaleDateString('it-IT')}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
