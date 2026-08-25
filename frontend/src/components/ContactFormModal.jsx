import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import Avatar from "./Avatar";

const emptyForm = () => ({
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

function ContactFormModal({ show, contact, onClose, onSaved }) {
    const isEditMode = Boolean(contact);

    const [form, setForm] = useState(emptyForm());
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const modalRef = useRef(null);

    // ================= POPULATE / RESET FORM =================

    useEffect(() => {
        if (!show) {
            return;
        }

        setError("");

        if (contact) {
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
        } else {
            setForm(emptyForm());
        }
    }, [show, contact]);

    // ================= MODAL ACCESSIBILITY =================

    useEffect(() => {
        if (!show) {
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
        const lastFocusable = focusableElements[focusableElements.length - 1];

        firstFocusable?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (!saving) {
                    onClose();
                }
                return;
            }

            if (event.key === "Tab") {
                if (event.shiftKey && document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable?.focus();
                } else if (!event.shiftKey && document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable?.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    if (!show) {
        return null;
    }

    // ================= FIELD HANDLERS =================

    const handleBasicChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEmailChange = (index, field, value) => {
        setForm((previous) => ({
            ...previous,
            emails: previous.emails.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handlePhoneChange = (index, field, value) => {
        setForm((previous) => ({
            ...previous,
            phones: previous.phones.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
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
            emails: previous.emails.filter((_, i) => i !== index),
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
            phones: previous.phones.filter((_, i) => i !== index),
        }));
    };

    // ================= SUBMIT =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const hasEmail = form.emails.some((item) => item.email.trim() !== "");
        const hasPhone = form.phones.some((item) => item.phone.trim() !== "");

        if (!hasEmail && !hasPhone) {
            setError("Please provide at least an email address or phone number.");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                ...form,
                emails: form.emails.filter((item) => item.email.trim() !== ""),
                phones: form.phones.filter((item) => item.phone.trim() !== ""),
            };

            if (isEditMode) {
                await api.put(`/contacts/${contact.id}`, payload);
            } else {
                await api.post("/contacts", payload);
            }

            onSaved();
        } catch (err) {
            console.error(
                `Failed to ${isEditMode ? "update" : "create"} contact:`,
                err.response?.status,
                err.code
            );

            if (err.response?.status === 401) {
                onClose();
                return;
            }

            const responseData = err.response?.data;

            if (responseData && typeof responseData === "object") {
                const messages = Object.values(responseData)
                    .filter(Boolean)
                    .join(", ");

                setError(messages || `Failed to ${isEditMode ? "update" : "create"} contact.`);
            } else {
                setError(`Failed to ${isEditMode ? "update" : "create"} contact.`);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleBackdropClick = () => {
        if (!saving) {
            onClose();
        }
    };

    return (
        <div
            ref={modalRef}
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-form-title"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={handleBackdropClick}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="contact-form-title">
                            {isEditMode ? "Edit Contact" : "Add Contact"}
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                            disabled={saving}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* BASIC INFORMATION */}

                            <div className="d-flex justify-content-center mb-4">
                                <Avatar
                                    firstName={form.firstName}
                                    lastName={form.lastName}
                                    size={72}
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">First Name *</label>

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
                                    <label className="form-label">Last Name *</label>

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

                            <div className="mb-3">
                                <label className="form-label">Title</label>

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

                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>Email Addresses</strong>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addEmail}
                                >
                                    + Add Email
                                </button>
                            </div>

                            {form.emails.map((email, index) => (
                                <div className="row mb-2" key={index}>
                                    <div className="col-md-7">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Email address"
                                            value={email.email}
                                            onChange={(e) =>
                                                handleEmailChange(index, "email", e.target.value)
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
                                                handleEmailChange(index, "label", e.target.value)
                                            }
                                            maxLength={30}
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger w-100"
                                            onClick={() => removeEmail(index)}
                                            disabled={form.emails.length === 1}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <hr />

                            {/* PHONES */}

                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>Phone Numbers</strong>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addPhone}
                                >
                                    + Add Phone
                                </button>
                            </div>

                            {form.phones.map((phone, index) => (
                                <div className="row mb-2" key={index}>
                                    <div className="col-md-7">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Phone number"
                                            value={phone.phone}
                                            onChange={(e) =>
                                                handlePhoneChange(index, "phone", e.target.value)
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
                                                handlePhoneChange(index, "label", e.target.value)
                                            }
                                            maxLength={30}
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger w-100"
                                            onClick={() => removePhone(index)}
                                            disabled={form.phones.length === 1}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving
                                    ? "Saving..."
                                    : isEditMode
                                    ? "Update Contact"
                                    : "Save Contact"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactFormModal;
