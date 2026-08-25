import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        emailOrPhone: "",
        password: "",
    });

    const [error, setError] = useState("");
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
        setLoading(true);

        try {
            await api.post("/auth/login", form);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Invalid email or password"
            );
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

            <div className="card shadow-lg border-0" style={{ maxWidth: 400, width: "100%" }}>
                <div className="card-body p-4 p-md-5">

                    <h4 className="fw-bold mb-1">
                        Welcome back
                    </h4>

                    <p className="text-muted mb-4">
                        Log in to manage your contacts.
                    </p>

                    {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                id="emailOrPhone"
                                name="emailOrPhone"
                                className="form-control"
                                placeholder="Email or Phone"
                                value={form.emailOrPhone}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="emailOrPhone">
                                Email or Phone
                            </label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="password">
                                Password
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                </div>
            </div>

            <div className="card shadow-sm border-0 mt-3 text-center" style={{ maxWidth: 400, width: "100%" }}>
                <div className="card-body py-3">
                    Don't have an account?{" "}
                    <Link to="/register" className="fw-semibold text-decoration-none">
                        Sign up
                    </Link>
                </div>
            </div>

        </AuthLayout>
    );
}

export default Login;
