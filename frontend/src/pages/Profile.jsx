import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

    // ================= LOAD PROFILE =================

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/auth/me");

            setUser(response.data);

        } catch (err) {
            console.error("Failed to load profile:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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
                err
            );

            const responseData = err.response?.data;

            if (
                err.response?.status === 401 &&
                !err.config?.url?.includes("change-password")
            ) {
                localStorage.removeItem("token");
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
        <div className="container-fluid">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">

                <span className="navbar-brand">
                    Contact Management System
                </span>

                <div className="ms-auto d-flex gap-2">

                    <button
                        className="btn btn-outline-light"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        className="btn btn-light"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* ================= PROFILE ================= */}

            <div
                className="container mt-4"
                style={{ maxWidth: "600px" }}
            >

                <h2 className="mb-4">
                    My Profile
                </h2>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center mt-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="mt-2">
                            Loading profile...
                        </p>

                    </div>
                )}

                {!loading && user && (

                    <div className="card shadow-sm">

                        <div className="card-body p-4">

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
                    className="modal d-block"
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

                                <h5 className="modal-title">
                                    Change Password
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                    disabled={saving}
                                />

                            </div>

                            <form
                                onSubmit={handlePasswordSubmit}
                            >

                                <div className="modal-body">

                                    {passwordError && (
                                        <div className="alert alert-danger">
                                            {passwordError}
                                        </div>
                                    )}

                                    {passwordSuccess && (
                                        <div className="alert alert-success">
                                            {passwordSuccess}
                                        </div>
                                    )}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Old Password
                                        </label>

                                        <input
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

                                        <label className="form-label">
                                            New Password
                                        </label>

                                        <input
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

        </div>
    );
}

export default Profile;