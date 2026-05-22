import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

declare global {
  interface Window {
    Quill: any;
  }
}

function useQuill(
  ref: React.RefObject<HTMLDivElement>,
  value: string,
  onChange: (v: string) => void
) {
  const quillRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.getElementById("quill-css")) {
      const link = document.createElement("link");
      link.id = "quill-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
      document.head.appendChild(link);
    }

    const initQuill = () => {
      if (!ref.current || quillRef.current) return;
      quillRef.current = new window.Quill(ref.current, {
        theme: "snow",
        placeholder: "Введите текст политики конфиденциальности...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            ["clean"],
          ],
        },
      });
      quillRef.current.on("text-change", () => {
        onChange(quillRef.current.root.innerHTML);
      });
      setReady(true);
    };

    if (window.Quill) {
      initQuill();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
      script.onload = initQuill;
      document.head.appendChild(script);
    }

    return () => {
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      ready &&
      quillRef.current &&
      value &&
      quillRef.current.root.innerHTML !== value
    ) {
      quillRef.current.root.innerHTML = value;
    }
  }, [ready, value]);
}

export default function AdminOther() {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [privacyHtml, setPrivacyHtml] = useState("");
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useQuill(editorRef, privacyHtml, setPrivacyHtml);

  useEffect(() => {
    api.get("/settings/banner_url").then((r) => {
      if (r.data.value) setCurrentBanner(r.data.value);
    });
    api.get("/settings/privacy_policy").then((r) => {
      setPrivacyHtml(r.data.value || "");
    });
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const handleBannerUpload = async () => {
    if (!bannerFile) return;
    setUploadingBanner(true);
    const fd = new FormData();
    fd.append("image", bannerFile);
    try {
      const r = await api.post("/settings/banner/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentBanner(r.data.value);
      setBannerFile(null);
      setBannerPreview(null);
      toast.success("Баннер обновлён");
    } catch {
      toast.error("Ошибка загрузки");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      await api.put("/settings/privacy_policy", { value: privacyHtml });
      toast.success("Политика сохранена");
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSavingPrivacy(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-brand-dark">
          Прочие настройки
        </h1>
        <p className="font-body text-brand-muted text-sm mt-1">
          Баннер главной страницы и политика конфиденциальности
        </p>
      </div>

      {/* Баннер */}
      <div className="bg-white p-6 mb-6">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-muted border-b border-brand-cream pb-3 mb-5">
          Баннер главной страницы
        </p>
        {currentBanner && (
          <div className="mb-5">
            <p className="font-body text-xs text-brand-muted mb-2">
              Текущий баннер:
            </p>
            <div className="w-full h-48 overflow-hidden bg-brand-cream">
              <img
                src={currentBanner}
                alt="Текущий баннер"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div className="mb-4">
          <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">
            Загрузить новый баннер
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="px-4 py-2 border border-brand-primary text-brand-primary font-body text-xs tracking-wider hover:bg-brand-primary hover:text-white transition-colors">
              Выбрать файл
            </div>
            <span className="font-body text-sm text-brand-muted">
              {bannerFile ? bannerFile.name : "Файл не выбран"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleBannerChange}
              className="hidden"
            />
          </label>
        </div>
        {bannerPreview && (
          <div className="mb-4">
            <p className="font-body text-xs text-brand-muted mb-2">
              Предпросмотр:
            </p>
            <div className="w-full h-48 overflow-hidden bg-brand-cream">
              <img
                src={bannerPreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <button
          onClick={handleBannerUpload}
          disabled={!bannerFile || uploadingBanner}
          className="bg-brand-primary text-white font-body text-sm tracking-wider px-6 py-2.5 hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {uploadingBanner ? "Загрузка..." : "Сохранить баннер"}
        </button>
      </div>

      {/* Политика */}
      <div className="bg-white p-6">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-muted border-b border-brand-cream pb-3 mb-5">
          Политика конфиденциальности
        </p>
        <p className="font-body text-xs text-brand-muted mb-4">
          Текст отображается на странице{" "}
          <code className="bg-brand-cream px-1">/privacy</code>.
        </p>
        <div className="mb-5 border border-brand-light">
          <div
            ref={editorRef}
            style={{ minHeight: "320px", fontFamily: "Jost, sans-serif" }}
          />
        </div>
        <button
          onClick={handleSavePrivacy}
          disabled={savingPrivacy}
          className="bg-brand-primary text-white font-body text-sm tracking-wider px-6 py-2.5 hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {savingPrivacy ? "Сохранение..." : "Сохранить политику"}
        </button>
      </div>
    </div>
  );
}
