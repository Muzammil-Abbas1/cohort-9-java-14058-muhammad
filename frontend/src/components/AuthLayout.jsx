import ThemeToggle from "./ThemeToggle";

function AuthLayout({ children }) {
    return (
        <div className="min-vh-100 d-flex position-relative">

            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 10 }}>
                <ThemeToggle variant="secondary" />
            </div>

            {/* ================= BRAND PANEL (DESKTOP) ================= */}

            <div
                className="d-none d-lg-flex col-lg-5 flex-column justify-content-center align-items-center text-white p-5 text-center"
                style={{ background: "linear-gradient(135deg, #4361ee, #7209b7)" }}
            >
                <div
                    className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center mb-4 fw-bold fs-1"
                    style={{ width: 88, height: 88 }}
                >
                    C
                </div>

                <h1 className="fw-bold mb-3">ContactHub</h1>

                <p className="fs-5 mb-0" style={{ maxWidth: 380, opacity: 0.9 }}>
                    Keep every relationship organized, searchable, and one click away.
                </p>
            </div>

            {/* ================= FORM PANEL ================= */}

            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4">
                {children}
            </div>

        </div>
    );
}

export default AuthLayout;
