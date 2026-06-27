import requests
import xml.etree.ElementTree as ET
from typing import List, Dict, Any

def fetch_work_news(limit: int = 6) -> List[Dict[str, Any]]:
    """
    Scarica le ultime notizie sul mondo del lavoro tramite il feed RSS di Google News.
    """
    url = "https://news.google.com/rss/search?q=lavoro+OR+occupazione+when:1d&hl=it&gl=IT&ceid=IT:it"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Errore durante il fetch delle news: {e}")
        return []

    news_list = []
    try:
        root = ET.fromstring(response.content)
        channel = root.find("channel")
        if channel is None:
            return []

        for item in channel.findall("item")[:limit]:
            title = item.find("title")
            link = item.find("link")
            pubDate = item.find("pubDate")
            source = item.find("source")

            news_list.append({
                "title": title.text if title is not None else "Senza titolo",
                "link": link.text if link is not None else "#",
                "pubDate": pubDate.text if pubDate is not None else "",
                "source": source.text if source is not None else "Google News",
            })
    except ET.ParseError as e:
        print(f"Errore durante il parsing del feed RSS: {e}")
        return []

    return news_list

if __name__ == "__main__":
    # Test veloce
    news = fetch_work_news()
    for n in news:
        print(n)
