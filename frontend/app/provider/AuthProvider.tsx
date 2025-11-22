import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "~/store/auth";
import { getMe } from "~/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const setAuth = useAuthStore((s) => s.setAuth);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded: any = jwtDecode(token);

                // hydrate store instantly
                setAuth(
                    {
                        userId: decoded.userId,
                        username: decoded.username ?? "",
                        lastname: decoded.lastname ?? "",
                        firstname: decoded.firstname ?? "",
                        role: decoded.role,
                    },
                    token
                );
            } catch (_) {}
        }

        // sync server async, no flash
        if (token) {
            getMe().then((data) => {
                setAuth(
                    { ...data.user, role: data.role },
                    token
                );
            });
        }

        setReady(true);
    }, []);

    if (!ready) {
        return null; // pas de flash visible
    }

    return <>{children}</>;
}
