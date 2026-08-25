import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/auth/register", form);

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            const responseData = err.response?.data;

            if (typeof responseData === "object" && responseData !== null) {
                setError(
                    Object.values(responseData).join(", ")
                );
            } else {
                setError(
                    responseData?.error ||
                    "Registration failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>

            <div className="d-lg-none text-center mb-4">
                <div
                    className="rounded-circle bg-primary text-white mx-auto d-flex align-items-center justify-content-center mb-3 fw-bold fs-3"
                    style={{ width: 64, height: 64 }}
                >
                    C
                </div>
                <h2 className="fw-bold text-primary mb-0">
                    ContactHub
                </h2>
            </div>

            <div className="card shadow-lg border-0" style={{ maxWidth: 460, width: "100%" }}>
                <div className="card-body p-4 p-md-5">

                    <h4 className="fw-bold mb-1">
                        Create your account
                    </h4>

                    <p className="text-muted mb-4">
                        Start organizing your contacts today.
                    </p>

                    {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success py-2">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="row g-2">
                            <div className="col-6">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="form-control"
                                        placeholder="First Name"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        maxLength="50"
                                        required
                                    />
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="form-control"
                                        placeholder="Last Name"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        maxLength="50"
                                        required
                                    />
                                    <label htmlFor="lastName">
                                        Last Name
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="email">
                                Email
                            </label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="form-control"
                                placeholder="Phone"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength="20"
                            />
                            <label htmlFor="phone">
                                Phone (optional)
                            </label>
                        </div>

                        <div className="form-floating mb-1">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                minLength="8"
                                maxLength="100"
                                required
                            />
                            <label htmlFor="password">
                                Password
                            </label>
                        </div>

                        <div className="form-text mb-3">
                            Password must be at least 8 characters.
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                    </form>

                </div>
            </div>

            <div className="card shadow-sm border-0 mt-3 text-center" style={{ maxWidth: 460, width: "100%" }}>
                <div className="card-body py-3">
                    Already have an account?{" "}
                    <Link to="/login" className="fw-semibold text-decoration-none">
                        Login
                    </Link>
                </div>
            </div>

        </AuthLayout>
    );
}

export default Register;
