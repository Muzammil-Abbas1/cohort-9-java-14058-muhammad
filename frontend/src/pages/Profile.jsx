import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AppShell from "../components/AppShell";
import Avatar from "../components/Avatar";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const modalRef = useRef(null);
    const changePasswordButtonRef = useRef(null);

    // ================= LOAD PROFILE =================

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/auth/me");

            setUser(response.data);

        } catch (err) {
            console.error(
                "Failed to load profile:",
                err.code,
                err.response?.status
            );

            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.error ||
                "Failed to load profile."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // ================= LOGOUT =================

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error(
                "Logout failed:",
                err.code,
                err.response?.status
            );
        } finally {
            navigate("/login");
        }
    };

    // ================= PASSWORD FORM =================

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value,
        });
    };

    const openModal = () => {
        setPasswordForm({
            oldPassword: "",
            newPassword: "",
        });

        setPasswordError("");
        setPasswordSuccess("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (!saving) {
            setShowModal(false);
        }
    };

    // ================= MODAL ACCESSIBILITY =================

    useEffect(() => {
        if (!showModal) {
            return;
        }

        const modal = modalRef.current;

        if (!modal) {
            return;
        }

        const previouslyFocused = document.activeElement;

        const focusableElements = modal.querySelectorAll(
            'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable =
            focusableElements[focusableElements.length - 1];

        firstFocusable?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal();
                return;
            }

            if (event.key === "Tab") {
                if (
                    event.shiftKey &&
                    document.activeElement === firstFocusable
                ) {
                    event.preventDefault();
                    lastFocusable?.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === lastFocusable
                ) {
                    event.preventDefault();
                    firstFocusable?.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            previouslyFocused?.focus();
        };
    }, [showModal]);

    // ================= CHANGE PASSWORD =================

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordError("");
        setPasswordSuccess("");
        setSaving(true);

        try {
            await api.put(
                "/auth/change-password",
                passwordForm
            );

            setPasswordSuccess(
                "Password changed successfully!"
            );

            setPasswordForm({
                oldPassword: "",
                newPassword: "",
            });

            setTimeout(() => {
                setShowModal(false);
            }, 1200);

        } catch (err) {
            console.error(
                "Failed to change password:",
                err.code,
                err.response?.status
            );

            const responseData = err.response?.data;

            if (
                err.response?.status === 401 &&
                !err.config?.url?.includes("change-password")
            ) {
                navigate("/login");
                return;
            }

            if (
                typeof responseData === "object" &&
                responseData !== null
            ) {
                setPasswordError(
                    Object.values(responseData).join(", ")
                );
            } else if (typeof responseData === "string") {
                setPasswordError(responseData);
            } else {
                setPasswordError(
                    "Failed to change password."
                );
            }

        } finally {
            setSaving(false);
        }
    };

    // ================= UI =================

    return (
        <AppShell active="profile" title="Profile" subtitle="Your account details.">

            <div style={{ maxWidth: "600px" }}>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="card shadow-sm" aria-busy="true" aria-live="polite">

                        <div className="card-body p-4">

                            <span className="visually-hidden">
                                Loading profile...
                            </span>

                            {["First Name", "Last Name", "Email", "Phone"].map((label) => (
                                <div className="mb-3" key={label}>
                                    <strong className="text-muted">{label}</strong>
                                    <span
                                        className="skeleton skeleton-text mt-1"
                                        style={{ width: "45%", height: "1.1rem" }}
                                    />
                                </div>
                            ))}

                            <div className="d-flex gap-2">
                                <span className="skeleton" style={{ width: "9.5rem", height: "2.375rem", borderRadius: "0.375rem" }} />
                                <span className="skeleton" style={{ width: "6rem", height: "2.375rem", borderRadius: "0.375rem" }} />
                            </div>

                        </div>

                    </div>
                )}

                {!loading && user && (

                    <div className="card shadow-sm">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center gap-3 mb-4">
                                <Avatar
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    size={64}
                                />
                                <div>
                                    <h4 className="mb-0">
                                        {user.firstName} {user.lastName}
                                    </h4>
                                    <p className="text-muted mb-0 small">
                                        {user.email || user.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <strong>
                                    First Name
                                </strong>

                                <p className="mb-0">
                                    {user.firstName}
                                </p>
                            </div>

                            <div className="mb-3">
                                <strong>
                                    Last Name
                                </strong>

                                <p className="mb-0">
                                    {user.lastName}
                                </p>
                            </div>

                            <div className="mb-3">
                                <strong>
                                    Email
                                </strong>

                                <p className="mb-0">
                                    {user.email || "—"}
                                </p>
                            </div>

                            <div className="mb-3">
                                <strong>
                                    Phone
                                </strong>

                                <p className="mb-0">
                                    {user.phone || "—"}
                                </p>
                            </div>

                            <button
                                ref={changePasswordButtonRef}
                                className="btn btn-primary me-2"
                                onClick={openModal}
                            >
                                Change Password
                            </button>

                            <button
                                className="btn btn-outline-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                )}

            </div>

            {/* ================= CHANGE PASSWORD MODAL ================= */}

            {showModal && (

                <div
                    ref={modalRef}
                    className="modal d-block"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="change-password-title"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.5)"
                    }}
                    onClick={closeModal}
                >

                    <div
                        className="modal-dialog modal-dialog-centered"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5
                                    className="modal-title"
                                    id="change-password-title"
                                >
                                    Change Password
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={closeModal}
                                    disabled={saving}
                                />

                            </div>

                            <form
                                onSubmit={handlePasswordSubmit}
                            >

                                <div className="modal-body">

                                    {passwordError && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {passwordError}
                                        </div>
                                    )}

                                    {passwordSuccess && (
                                        <div
                                            className="alert alert-success"
                                            role="alert"
                                        >
                                            {passwordSuccess}
                                        </div>
                                    )}

                                    <div className="mb-3">

                                        <label
                                            className="form-label"
                                            htmlFor="old-password"
                                        >
                                            Old Password
                                        </label>

                                        <input
                                            id="old-password"
                                            type="password"
                                            name="oldPassword"
                                            className="form-control"
                                            value={
                                                passwordForm.oldPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            minLength={8}
                                            required
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label
                                            className="form-label"
                                            htmlFor="new-password"
                                        >
                                            New Password
                                        </label>

                                        <input
                                            id="new-password"
                                            type="password"
                                            name="newPassword"
                                            className="form-control"
                                            value={
                                                passwordForm.newPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            minLength={8}
                                            required
                                        />

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </AppShell>
    );
}

export default Profile;