import React from "react";
import { useTranslation } from "react-i18next";

const frFlag = "/icon/french-flag.png";
const enFlag = "/icon/english-flag.png";

export function LangSwitcher() {
  const { i18n } = useTranslation(undefined, { useSuspense: false });
  const current = (i18n.language || "fr").slice(0, 2) as "fr" | "en";

  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const setLang = async (lng: "fr" | "en") => {
    await i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    setOpen(false);
  };

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const label = current === "fr" ? "FR" : "EN";

  return (
    <div ref={ref} className="relative z-150">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold
          border border-white/10 bg-white/5 hover:bg-white/10 transition
        "
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Changer de langue"
      >
        {current === "fr" && (
          <img src={frFlag} alt="Langue" className="h-5 w-5 rounded-sm" />
        )}
        {current === "en" && (
          <img src={enFlag} alt="Language" className="h-5 w-5 rounded-sm" />
        )}
        <span className="opacity-90">{label}</span>
        <span
          className={`text-xs opacity-70 transition ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl
            border border-white/10 bg-[var(--background)]/90 backdrop-blur
            shadow-xl
          "
          role="menu"
        >
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={`
              w-full px-4 py-3 text-left text-sm transition
              hover:bg-white/10
              ${current === "fr" ? "bg-white/10" : ""}
            `}
            role="menuitem"
          >
            <div className="flex items-center gap-2">
              <img src={frFlag} alt="FR" className="h-5 w-5 rounded-sm" />
              <span>Français</span>
              {current === "fr" && (
                <span className="ml-auto opacity-70">✓</span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLang("en")}
            className={`
              w-full px-4 py-3 text-left text-sm transition
              hover:bg-white/10
              ${current === "en" ? "bg-white/10" : ""}
            `}
            role="menuitem"
          >
            <div className="flex items-center gap-2">
              {/* petit “flag” EN sans image: cercle + EN */}
              <img src={enFlag} alt="EN" className="h-5 w-5 rounded-sm" />
              <span>English</span>
              {current === "en" && (
                <span className="ml-auto opacity-70">✓</span>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
