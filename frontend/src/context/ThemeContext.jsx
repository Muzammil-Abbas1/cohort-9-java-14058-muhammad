import { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context.js";

const STORAGE_KEY = "cms-theme";

function getInitialTheme() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored === "light" || stored === "dark") {
            return stored;
        }
    } catch {
        // Storage access blocked (privacy settings, sandboxed context, etc.)
        // -- fall through to the system preference below.
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme);

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Persistence failed -- the active theme still works for
            // this session, it just won't be remembered next time.
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
