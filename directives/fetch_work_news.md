# Directive: Fetch Work News

**Obiettivo:**
Recuperare le ultime notizie relative al "mondo del lavoro" da una fonte attendibile e gratuita per mostrarle sulla dashboard principale dell'applicazione.

**Vincoli:**
- Non utilizzare API a pagamento (es. NewsAPI).
- Utilizzare una fonte sempre aggiornata.
- Evitare sovraccarichi e limiti di rate-limiting.

**Input:**
- Nessun input diretto da parte dell'utente.
- Termini di ricerca impliciti: "lavoro" OR "occupazione".

**Output:**
- Una lista di dizionari (in Python) contenente: `title`, `link`, `pubDate`, `source`.

**Strumenti/Script da usare:**
- Eseguire lo script deterministico `execution/fetch_work_news.py`.

**Approccio consigliato:**
Lo script deve scaricare il feed RSS di Google News utilizzando il modulo standard `urllib.request` o `requests` di Python.
URL suggerito: `https://news.google.com/rss/search?q=lavoro+OR+occupazione+when:1d&hl=it&gl=IT&ceid=IT:it`

Il feed restituito è in formato XML. Bisogna parsarlo (es. tramite `xml.etree.ElementTree`) per estrarre i nodi `<item>` e mapparli nell'output desiderato. Limitare i risultati a 6-10 notizie.

**Casi limite gestiti:**
- Se la richiesta di rete fallisce, lo script deve sollevare un'eccezione chiara.
- Se il formato dell'XML cambia o alcuni campi mancano, lo script dovrebbe gestire la mancanza restituendo stringhe vuote o saltando l'elemento per evitare blocchi dell'applicazione.
