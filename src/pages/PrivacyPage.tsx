import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/settings/privacy_policy")
      .then((r) => setHtml(r.data.value || ""))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 lg:px-12 py-32">
        <button
          onClick={() => navigate(-1)}
          className="font-body text-xs tracking-[0.2em] uppercase text-brand-muted hover:text-brand-primary transition-colors mb-8 flex items-center gap-2"
        >
          ← Назад
        </button>
        <h1 className="font-display text-4xl font-light text-brand-dark mb-10">
          Политика конфиденциальности
        </h1>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : html ? (
          <div
            className="prose prose-sm max-w-none font-body text-brand-dark leading-relaxed
                       [&_h1]:font-display [&_h1]:font-light [&_h1]:text-brand-dark
                       [&_h2]:font-display [&_h2]:font-light [&_h2]:text-brand-dark
                       [&_h3]:font-display [&_h3]:font-light [&_h3]:text-brand-dark
                       [&_a]:text-brand-primary [&_a]:underline
                       [&_ul]:list-disc [&_ul]:pl-5
                       [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="font-body text-brand-muted">
            Текст политики ещё не добавлен.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
