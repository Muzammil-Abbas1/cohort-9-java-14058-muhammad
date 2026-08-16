import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
            const response = await api.post("/auth/login", form);

            localStorage.setItem("token", response.data.token);

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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">
                                Contact Management System
                            </h2>

                            <h4 className="text-center mb-4">
                                Login
                            </h4>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email or Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="emailOrPhone"
                                        className="form-control"
                                        value={form.emailOrPhone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>

                            </form>

                            <div className="text-center mt-3">
                                Don't have an account?{" "}
                                <Link to="/register">
                                    Register
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;