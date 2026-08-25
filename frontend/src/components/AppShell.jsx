import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
    { key: "contacts", label: "Contacts", path: "/dashboard", icon: "👤" },
    { key: "favorites", label: "Favorites", path: "/favorites", icon: "⭐" },
    { key: "profile", label: "Profile", path: "/profile", icon: "👤" },
];

function AppShell({ active, title, subtitle, onAddContact, headerActions, children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        let cancelled = false;

        api.get("/auth/me")
            .then((response) => {
                if (!cancelled) {
                    setUser(response.data);
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Logout failed:", err.response?.status, err.code);
        } finally {
            navigate("/login");
        }
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>

            {/* ================= DESKTOP SIDEBAR ================= */}

            <aside
                className="d-none d-md-flex flex-column border-end p-3 flex-shrink-0"
                style={{ width: 240 }}
            >
                <div className="d-flex align-items-center gap-2 mb-4">
                    <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{ width: 36, height: 36 }}
                    >
                        C
                    </div>
                    <div>
                        <div className="fw-bold text-primary lh-sm">ContactHub</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Contact Manager
                        </div>
                    </div>
                </div>

                {onAddContact && (
                    <button
                        type="button"
                        className="btn btn-primary mb-4 text-start"
                        onClick={onAddContact}
                    >
                        + Add Contact
                    </button>
                )}

                <nav className="d-flex flex-column gap-1">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`btn text-start ${
                                active === item.key ? "btn-primary" : "btn-light"
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="me-2">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto d-flex flex-column gap-2">
                    <ThemeToggle variant="secondary" />
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* ================= MAIN COLUMN ================= */}

            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>

                {/* ================= MOBILE TOP BAR ================= */}

                <div className="d-flex d-md-none align-items-center justify-content-between p-3 border-bottom bg-body sticky-top">
                    <div className="d-flex align-items-center gap-2">
                        <Avatar
                            firstName={user?.firstName}
                            lastName={user?.lastName}
                            size={32}
                        />
                        <span className="fw-bold text-primary fs-5">{title}</span>
                    </div>

                    <div className="d-flex gap-2">
                        <ThemeToggle variant="secondary" />
                    </div>
                </div>

                <main
                    className="flex-grow-1 p-3 p-md-4"
                    style={{ paddingBottom: onAddContact ? "6rem" : undefined }}
                >

                    {/* ================= DESKTOP HEADER ================= */}

                    <div className="d-none d-md-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="mb-1">{title}</h2>
                            {subtitle && (
                                <p className="text-muted mb-0">{subtitle}</p>
                            )}
                        </div>

                        {headerActions && (
                            <div className="d-flex gap-2">{headerActions}</div>
                        )}
                    </div>

                    {children}

                </main>

                {/* ================= MOBILE FAB ================= */}

                {onAddContact && (
                    <button
                        type="button"
                        className="btn btn-primary rounded-circle d-md-none position-fixed shadow-lg d-flex align-items-center justify-content-center fs-3"
                        style={{
                            width: 56,
                            height: 56,
                            bottom: "5.25rem",
                            right: "1.25rem",
                            zIndex: 1030,
                        }}
                        onClick={onAddContact}
                        aria-label="Add Contact"
                    >
                        +
                    </button>
                )}

                {/* ================= MOBILE BOTTOM NAV ================= */}

                <nav
                    className="d-flex d-md-none border-top bg-body position-fixed bottom-0 start-0 end-0"
                    style={{ zIndex: 1020 }}
                >
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`btn flex-fill rounded-0 py-2 ${
                                active === item.key ? "text-primary" : "text-muted"
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            <div className="fs-5 lh-1">{item.icon}</div>
                            <div style={{ fontSize: "0.7rem" }}>{item.label}</div>
                        </button>
                    ))}
                </nav>

            </div>

        </div>
    );
}

export default AppShell;
