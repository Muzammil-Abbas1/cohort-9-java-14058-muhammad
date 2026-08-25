import { useTheme } from "../context/useTheme.js";

function ThemeToggle({ variant = "light" }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            className={`btn btn-outline-${variant} theme-toggle-btn`}
            onClick={toggleTheme}
            aria-label={
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            title={
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
        >
            <span key={theme} className="theme-toggle-icon">
                {theme === "dark" ? "☀️" : "🌙"}
            </span>
        </button>
    );
}

export default ThemeToggle;
