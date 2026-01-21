import * as React from "react";
import { useAuthStore } from "~/store/auth";
import { useNavigate } from "react-router";
import { studentMenu, teacherMenu, useMenuStore } from "~/store/menu";
import { assetUrl } from "~/utils/url";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const auth = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const { navMain, setMenu, setActive } = useMenuStore();
  const t = useTranslation().t;

  React.useEffect(() => {
    if (!auth?.role) return;
    if (navMain && navMain.length > 0) return;

    setMenu(auth.role === "teacher" ? teacherMenu : studentMenu);
    setActive(location.pathname.slice(1) || "app/dashboard");
  }, [auth?.role]);

  function handleClick(url: string) {
    const target = url.startsWith("/") ? url : `/${url}`;
    setActive(url);
    navigate(target);
  }

  return (
    <div className="h-full w-80 bg-[var(--primary)] flex flex-col justify-between rounded-r-3xl overflow-hidden">
      <div>
        <div className="flex flex-col items-center py-6">
          <div className="h-28 w-28 bg-white rounded-full" />
          <p className="mt-4 font-semibold text-white">
            {auth?.username ?? "Guest"}
          </p>
        </div>

        <div className="h-[1px] w-full bg-white/30 mb-4" />

        <div className="flex flex-col">
          {navMain.map((item, index) => {
            const isActive = item.isActive;
            const aboveActive = navMain[index + 1]?.isActive;
            const belowActive = navMain[index - 1]?.isActive;

            return (
              <SidebarItem
                key={item.titleKey}
                icon={isActive ? item.iconDark : item.iconLight}
                label={t(item.titleKey)}
                active={isActive}
                aboveActive={aboveActive}
                belowActive={belowActive}
                onClick={() => handleClick(item.url)}
              />
            );
          })}
        </div>

        <div className="h-[1px] w-full bg-white/30 mt-2 mb-2" />

        <SidebarItem
          icon={assetUrl("logout/light.png")}
          label={t("menu.logout")}
          active={false}
          onClick={() => {
            useAuthStore.getState().logout();
            setMenu([]);
            navigate("/login");
          }}
        />
      </div>

      <div className="text-center text-[var(--background)] text-sm py-4">
        {t("menu.developped_by")}
        <Link
          to={import.meta.env.VITE_PORTFOLIO_LINK}
          className="font-medium hover:underline ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="font-medium">Anas Amiri</span>
        </Link>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  aboveActive,
  belowActive,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  aboveActive?: boolean;
  belowActive?: boolean;
  onClick?: () => void;
}) {
  // Arrondis “notch” autour de l’item actif
  const radiusClass = active
    ? "rounded-l-3xl "
    : aboveActive
      ? "rounded-br-3xl bg-[var(--primary)]"
      : belowActive
        ? "rounded-tr-3xl bg-[var(--primary)]"
        : "bg-[var(--primary)]";

  return (
    // ✅ wrapper SANS fond clair : on laisse le primary de la sidebar derrière
    <div className={`ml-4 ${active ? "" : "bg-[var(--background)]"}`}>
      <div className={` ${radiusClass} overflow-hidden`}>
        <button
          type="button"
          onClick={onClick}
          className={[
            "w-full text-left flex items-center gap-3 px-4 py-3",
            "cursor-pointer transition",
            // ✅ hover arrondi + couleur, sans “fuite” blanche
            active
              ? "bg-[var(--background)] text-black"
              : "bg-transparent text-white/95 hover:bg-[var(--secondary)] hover:rounded-l-3xl",
          ].join(" ")}
        >
          <img src={icon} alt={label} className="w-7 h-7 shrink-0" />
          <span className="font-medium">{label}</span>
        </button>
      </div>
    </div>
  );
}
