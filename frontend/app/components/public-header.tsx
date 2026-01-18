import React from "react";
import { Link } from "react-router-dom";
import { EduQcmLogo } from "./eduqcm-logo";
import { LangSwitcher } from "./lang-switcher";

type PublicHeaderProps = {
  icon?: React.ReactNode;
  text?: string;
  link?: string;
};

export default function PublicHeader({ icon, text, link }: PublicHeaderProps) {
  const [open, setOpen] = React.useState(false);

  const hasCta = Boolean(text && link);

  return (
    <header className="w-full">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="shrink-0">
          <EduQcmLogo />
        </Link>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          {hasCta && (
            <Link
              to={link!}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-[var(--primary)] text-white hover:opacity-90 transition"
            >
              {text}
              {icon && (
                <img src={icon as string} alt="" className="inline h-4 w-4" />
              )}
            </Link>
          )}

          <LangSwitcher />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10 transition"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            {hasCta ? (
              <Link
                to={link!}
                onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-[var(--primary)] text-white hover:opacity-90 transition"
              >
                {text}
                {icon && (
                  <img src={icon as string} alt="" className="inline h-4 w-4" />
                )}
              </Link>
            ) : (
              <div className="text-sm opacity-80">Menu</div>
            )}

            <LangSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
