import * as React from "react"
import {useAuthStore} from "~/store/auth";
import {useNavigate} from "react-router";
import {studentMenu, teacherMenu, useMenuStore} from "~/store/menu";

export function AppSidebar() {
    const auth = useAuthStore((state) => state.auth);
    const navigate = useNavigate();
    const { navMain, setMenu, setActive } = useMenuStore();

    React.useEffect(() => {
        if (!auth?.role) return;

        if (navMain && navMain.length > 0) return; // menu déjà défini

        if (auth.role === "teacher") {
            setMenu(teacherMenu);
        } else {
            setMenu(studentMenu);
        }

        setActive(location.pathname || "/dashboard");
    }, [auth?.role]);

    function handleClick(url: string) {
        setActive(url);
        navigate(url);
    }

    return (
        <div className="h-full w-80 bg-[var(--primary)] flex flex-col justify-between rounded-r-3xl overflow-hidden">

            {/* --- TOP SECTION --- */}
            <div>
                {/* Avatar */}
                <div className="flex flex-col items-center py-6">
                    <div className="h-28 w-28 bg-white rounded-full"></div>
                    <p className="mt-4 font-semibold text-white">{auth?.username ?? "Guest"}</p>
                </div>

                <div className="h-[1px] w-full bg-white/30 mb-4"></div>

                {/* Dynamic menu using your data */}
                <div className="flex flex-col">
                    {navMain.map((item, index) => {
                        const isActive = item.isActive;
                        const aboveActive = navMain[index + 1]?.isActive;
                        const belowActive = navMain[index - 1]?.isActive;

                        return (
                            <SidebarItem
                                key={item.title}
                                icon={item.icon}
                                label={item.title}
                                active={isActive}
                                aboveActive={aboveActive}
                                belowActive={belowActive}
                                onClick={() => handleClick(item.url)}
                            />
                        );
                    })}

                </div>

                <div className="h-[1px] w-full bg-white/30 mt-2 mb-2"></div>

                {/* Logout */}
                <SidebarItem icon="logout.png" label="Logout" active={false} onClick={
                    () => {
                        useAuthStore.getState().logout();
                        // on met le dashboard comme menu par défaut
                        setMenu([]);
                        navigate("/login");
                }}/>
            </div>

            {/* --- FOOTER --- */}
            <div className="text-center text-white text-sm py-4">
                Developed by <span className="font-semibold">Anas AMIRI</span>
            </div>
        </div>
    )
}


/* COMPONENT FOR EACH MENU ITEM */
function SidebarItem({
                         icon,
                         label,
                         active,
                         aboveActive,
                         belowActive,
                         onClick,
                     }: {
    icon: string
    label: string
    active?: boolean
    aboveActive?: boolean
    belowActive?: boolean
    onClick?: () => void
}) {

    // Gestion des arrondis selon la position
    const radiusClass =
        active
            ? "rounded-l-3xl ml-4"                   // arrondi complet + marge
            : aboveActive
                ? "rounded-br-3xl"                      // élément juste AU-DESSUS
                : belowActive
                    ? "rounded-tr-3xl"                      // élément juste EN-DESSOUS
                    : ""                       // forme par défaut (arrondi droite)

    return (
        <div className={active ? "" : "bg-[var(--background)]" }>
            <div onClick={onClick}
                className={`
        relative flex items-center gap-3 px-4 py-3 cursor-pointer transition
        ${active
                    ? "bg-[var(--background)] text-black"
                    : "bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--secondary)]"
                }
        ${radiusClass}
      `}
            >
                <img src={"pic/" + icon} alt={label} className="w-7 h-7"/>
                <span className="font-medium">{label}</span>
            </div>
        </div>
    )
}
