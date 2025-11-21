import * as React from "react"
import {useAuthStore} from "~/store/auth";

// This is sample data.
const data = {
    navMain: [
        {
            title: "Teacher",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    icon: "home.svg",
                    url: "#",
                },
                {
                    title: "QCMs Management",
                    icon: "quiz.png",
                    url: "#",
                },
                {
                    title: "Users Management",
                    icon: "user.png",
                    url: "#",
                },
                {
                    title: "Results",
                    icon: "result.png",
                    url: "#",
                },
                {
                    title: "Groupes Management",
                    icon: "group.png",
                    url: "#",
                },
                {
                    title: "Settings",
                    icon: "settings.svg",
                    url: "#",
                },
            ],
        },
        {
            title: "Student",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    icon: "home.svg",
                    url: "#",
                },
                {
                    title: "QCM assigned",
                    icon: "quiz.png",
                    url: "#",
                    isActive: true,
                },
                {
                    title: "Results",
                    icon: "result.png",
                    url: "#",
                },
                {
                    title: "Settings",
                    icon: "settings.svg",
                    url: "#",
                },
            ],
        },
    ],
}

export function AppSidebar() {
    const auth = useAuthStore((state) => state.auth);

    return (
        <div className="fixed left-0 top-0 h-screen w-80 bg-[var(--primary)] flex flex-col justify-between rounded-r-3xl overflow-hidden">

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
                    {data.navMain.map((section) => (
                        <div key={section.title} className="mb-4">
                            {section.items.map((item, index) => {
                                const isActive = item.isActive
                                const aboveActive = section.items[index + 1]?.isActive
                                const belowActive = section.items[index - 1]?.isActive

                                return (
                                    <SidebarItem
                                        key={item.title}
                                        icon={item.icon}
                                        label={item.title}
                                        active={isActive}
                                        aboveActive={aboveActive}
                                        belowActive={belowActive}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>

                <div className="h-[1px] w-full bg-white/30 mt-2 mb-2"></div>

                {/* Logout */}
                <SidebarItem icon="logout.png" label="Logout" active={false} />
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
                     }: {
    icon: string
    label: string
    active?: boolean
    aboveActive?: boolean
    belowActive?: boolean
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
            <div
                className={`
        relative flex items-center gap-3 px-4 py-3 cursor-pointer transition
        ${active
                    ? "bg-[var(--background)] text-black"
                    : "bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--secondary)]"
                }
        ${radiusClass}
      `}
            >
                <img src={"pic/" + icon} alt={label} className="w-7 h-7" />
                <span className="font-medium">{label}</span>
            </div>
        </div>
    )
}
