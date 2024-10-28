"use client";

import { useState } from 'react';

export default function ClientComponent() {
  const [loading, setLoading] = useState(false);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);

  const handleScrape = async () => {
    setLoading(true);
    setCsvUrl(null);

    try {
      const response = await fetch('/api/scrape');
      const data = await response.json();

      if (response.ok) {
        setCsvUrl(data.url);
      }
    } catch (error) {
      console.error("An error occurred during scraping:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-accent flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-primary mb-6">Stage Rankings Scraper</h1>
      <button
        onClick={handleScrape}
        className="bg-primary text-white px-6 py-3 rounded-3xl hover:bg-accent hover:text-secondary transition duration-300"
      >
        {loading ? 'Scraping...' : 'Start Scraping'}
      </button>

      {csvUrl && (
        <a
          href={csvUrl}
          download="rankings.csv"
          className="mt-4 text-primary underline"
        >
          Download Rankings CSV
        </a>
      )}
    </div>
  );
}
