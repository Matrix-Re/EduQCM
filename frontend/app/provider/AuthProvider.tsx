import { useEffect } from "react";
import { useAuthStore } from "~/store/auth";
import { getMe } from "~/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setAuth = useAuthStore((s) => s.setAuth);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        getMe()
            .then((data) => {
                setAuth(data.user, token);
            })
            .catch(() => {
                localStorage.removeItem("token");
            });
    }, []);

    return <>{children}</>;
}
