import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4">

                            <h2 className="text-center mb-2">
                                Contact Management System
                            </h2>

                            <h4 className="text-center mb-4">
                                Create Account
                            </h4>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            maxLength="50"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            className="form-control"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            maxLength="50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control"
                                        value={form.phone}
                                        onChange={handleChange}
                                        maxLength="20"
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
                                        minLength="8"
                                        maxLength="100"
                                        required
                                    />

                                    <div className="form-text">
                                        Password must be at least 8 characters.
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"}
                                </button>

                            </form>

                            <div className="text-center mt-3">
                                Already have an account?{" "}
                                <Link to="/login">
                                    Login
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;