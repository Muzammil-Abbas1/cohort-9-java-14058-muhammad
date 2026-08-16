import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

function EditContact() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        title: "",
        emails: [
            {
                email: "",
                label: "Work",
            },
        ],
        phones: [
            {
                phone: "",
                label: "Mobile",
            },
        ],
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // ================= LOAD CONTACT =================

    useEffect(() => {
        const loadContact = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/contacts/${id}`);

                const contact = response.data;

                setForm({
                    firstName: contact.firstName || "",
                    lastName: contact.lastName || "",
                    title: contact.title || "",

                    emails:
                        contact.emails?.length > 0
                            ? contact.emails.map((email) => ({
                                  email: email.email || "",
                                  label: email.label || "Work",
                              }))
                            : [
                                  {
                                      email: "",
                                      label: "Work",
                                  },
                              ],

                    phones:
                        contact.phones?.length > 0
                            ? contact.phones.map((phone) => ({
                                  phone: phone.phone || "",
                                  label: phone.label || "Mobile",
                              }))
                            : [
                                  {
                                      phone: "",
                                      label: "Mobile",
                                  },
                              ],
                });
            } catch (err) {
                console.error("Failed to load contact:", err);

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setError(
                    err.response?.data?.error ||
                    "Failed to load contact."
                );
            } finally {
                setLoading(false);
            }
        };

        loadContact();
    }, [id, navigate]);

    // ================= BASIC INPUT =================

    const handleBasicChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ================= EMAIL =================

    const handleEmailChange = (index, field, value) => {
        setForm((previous) => ({
            ...previous,

            emails: previous.emails.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            ),
        }));
    };

    const addEmail = () => {
        setForm((previous) => ({
            ...previous,

            emails: [
                ...previous.emails,
                {
                    email: "",
                    label: "Work",
                },
            ],
        }));
    };

    const removeEmail = (index) => {
        setForm((previous) => ({
            ...previous,

            emails: previous.emails.filter(
                (_, i) => i !== index
            ),
        }));
    };

    // ================= PHONE =================

    const handlePhoneChange = (index, field, value) => {
        setForm((previous) => ({
            ...previous,

            phones: previous.phones.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            ),
        }));
    };

    const addPhone = () => {
        setForm((previous) => ({
            ...previous,

            phones: [
                ...previous.phones,
                {
                    phone: "",
                    label: "Mobile",
                },
            ],
        }));
    };

    const removePhone = (index) => {
        setForm((previous) => ({
            ...previous,

            phones: previous.phones.filter(
                (_, i) => i !== index
            ),
        }));
    };

    // ================= UPDATE CONTACT =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSaving(true);

        try {
            const payload = {
                ...form,

                emails: form.emails.filter(
                    (item) => item.email.trim() !== ""
                ),

                phones: form.phones.filter(
                    (item) => item.phone.trim() !== ""
                ),
            };

            await api.put(`/contacts/${id}`, payload);

            navigate("/dashboard");
        } catch (err) {
            console.error("Failed to update contact:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            const responseData = err.response?.data;

            if (typeof responseData === "object") {
                const messages = Object.values(responseData)
                    .filter(Boolean)
                    .join(", ");

                setError(
                    messages ||
                    "Failed to update contact."
                );
            } else {
                setError("Failed to update contact.");
            }
        } finally {
            setSaving(false);
        }
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="mt-2">
                    Loading contact...
                </p>
            </div>
        );
    }

    // ================= PAGE =================

    return (
        <div className="container mt-4 mb-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2>Edit Contact</h2>

                    <p className="text-muted mb-0">
                        Update contact information
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="btn btn-outline-secondary"
                >
                    Back to Dashboard
                </Link>

            </div>

            {/* ERROR */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* FORM */}

            <div className="card shadow-sm">

                <div className="card-body p-4">

                    <form onSubmit={handleSubmit}>

                        {/* BASIC INFORMATION */}

                        <h5 className="mb-3">
                            Basic Information
                        </h5>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    First Name *
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    value={form.firstName}
                                    onChange={handleBasicChange}
                                    maxLength={50}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Last Name *
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    value={form.lastName}
                                    onChange={handleBasicChange}
                                    maxLength={50}
                                    required
                                />

                            </div>

                        </div>

                        {/* TITLE */}

                        <div className="mb-4">

                            <label className="form-label">
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={form.title}
                                onChange={handleBasicChange}
                                maxLength={100}
                                placeholder="e.g. Manager"
                            />

                        </div>

                        <hr />

                        {/* EMAILS */}

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h5 className="mb-0">
                                Email Addresses
                            </h5>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addEmail}
                            >
                                + Add Email
                            </button>

                        </div>

                        {form.emails.map((email, index) => (

                            <div
                                className="row mb-3"
                                key={index}
                            >

                                <div className="col-md-7">

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email address"
                                        value={email.email}
                                        onChange={(e) =>
                                            handleEmailChange(
                                                index,
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        maxLength={100}
                                    />

                                </div>

                                <div className="col-md-3">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Label"
                                        value={email.label}
                                        onChange={(e) =>
                                            handleEmailChange(
                                                index,
                                                "label",
                                                e.target.value
                                            )
                                        }
                                        maxLength={30}
                                    />

                                </div>

                                <div className="col-md-2">

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() =>
                                            removeEmail(index)
                                        }
                                        disabled={
                                            form.emails.length === 1
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                        <hr />

                        {/* PHONES */}

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h5 className="mb-0">
                                Phone Numbers
                            </h5>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addPhone}
                            >
                                + Add Phone
                            </button>

                        </div>

                        {form.phones.map((phone, index) => (

                            <div
                                className="row mb-3"
                                key={index}
                            >

                                <div className="col-md-7">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Phone number"
                                        value={phone.phone}
                                        onChange={(e) =>
                                            handlePhoneChange(
                                                index,
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        maxLength={20}
                                    />

                                </div>

                                <div className="col-md-3">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Label"
                                        value={phone.label}
                                        onChange={(e) =>
                                            handlePhoneChange(
                                                index,
                                                "label",
                                                e.target.value
                                            )
                                        }
                                        maxLength={30}
                                    />

                                </div>

                                <div className="col-md-2">

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() =>
                                            removePhone(index)
                                        }
                                        disabled={
                                            form.phones.length === 1
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                        <hr />

                        {/* ACTIONS */}

                        <div className="d-flex justify-content-end gap-2">

                            <Link
                                to="/dashboard"
                                className="btn btn-secondary"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Contact"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default EditContact;