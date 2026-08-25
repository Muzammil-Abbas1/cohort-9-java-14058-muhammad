import { useEffect, useRef } from "react";
import Avatar from "./Avatar";

function ContactDetailModal({ contact, onClose, onEdit, onDelete, onToggleFavorite }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!contact) {
            return;
        }

        const modal = modalRef.current;
        if (!modal) {
            return;
        }

        const previouslyFocused = document.activeElement;
        const focusable = modal.querySelectorAll(
            'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        focusable[0]?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contact]);

    if (!contact) {
        return null;
    }

    const primaryPhone = contact.phones?.[0]?.phone;
    const primaryEmail = contact.emails?.[0]?.email;

    const labels = [
        ...new Set(
            [
                ...(contact.emails || []).map((e) => e.label),
                ...(contact.phones || []).map((p) => p.label),
            ].filter(Boolean)
        ),
    ];

    return (
        <div
            ref={modalRef}
            className="modal d-block modal-animate-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-detail-title"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down modal-animate-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">

                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none px-0"
                            onClick={onClose}
                        >
                            ← Back
                        </button>

                        <h5
                            className="modal-title d-none d-sm-block flex-grow-1 text-center"
                            id="contact-detail-title"
                        >
                            Contact
                        </h5>

                        <div className="d-flex gap-1 flex-shrink-0">
                            <button
                                type="button"
                                className="btn btn-link text-decoration-none icon-action-btn"
                                onClick={() => onEdit(contact)}
                                aria-label="Edit contact"
                                title="Edit contact"
                            >
                                ✏️
                            </button>

                            <button
                                type="button"
                                className="btn btn-link text-decoration-none text-danger icon-action-btn"
                                onClick={() => onDelete(contact)}
                                aria-label="Delete contact"
                                title="Delete contact"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>

                    <div className="modal-body">

                        <div className="text-center mb-4">
                            <div className="d-flex justify-content-center mb-3">
                                <Avatar
                                    firstName={contact.firstName}
                                    lastName={contact.lastName}
                                    size={88}
                                />
                            </div>

                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <h4 className="mb-0">
                                    {contact.firstName} {contact.lastName}
                                </h4>

                                <button
                                    type="button"
                                    className="btn btn-sm p-0 border-0 bg-transparent fs-5"
                                    onClick={() => onToggleFavorite(contact)}
                                    aria-label={
                                        contact.favorite
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                    title={
                                        contact.favorite
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                >
                                    {contact.favorite ? "⭐" : "☆"}
                                </button>
                            </div>

                            {contact.title && (
                                <p className="text-muted mb-2">{contact.title}</p>
                            )}

                            {labels.length > 0 && (
                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    {labels.map((label) => (
                                        <span
                                            key={label}
                                            className="badge rounded-pill text-bg-primary-subtle text-primary-emphasis"
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ================= QUICK ACTIONS ================= */}

                        <div className="row g-2 mb-4">
                            <div className="col-4">
                                <a
                                    href={primaryPhone ? `tel:${primaryPhone}` : undefined}
                                    className={`btn btn-outline-secondary w-100 ${
                                        !primaryPhone ? "disabled" : ""
                                    }`}
                                    aria-disabled={!primaryPhone}
                                >
                                    📞<div className="small">Call</div>
                                </a>
                            </div>

                            <div className="col-4">
                                <a
                                    href={primaryPhone ? `sms:${primaryPhone}` : undefined}
                                    className={`btn btn-outline-secondary w-100 ${
                                        !primaryPhone ? "disabled" : ""
                                    }`}
                                    aria-disabled={!primaryPhone}
                                >
                                    💬<div className="small">Message</div>
                                </a>
                            </div>

                            <div className="col-4">
                                <a
                                    href={primaryEmail ? `mailto:${primaryEmail}` : undefined}
                                    className={`btn btn-outline-secondary w-100 ${
                                        !primaryEmail ? "disabled" : ""
                                    }`}
                                    aria-disabled={!primaryEmail}
                                >
                                    ✉️<div className="small">Email</div>
                                </a>
                            </div>
                        </div>

                        {/* ================= CONTACT INFORMATION ================= */}

                        {(contact.phones?.length > 0 || contact.emails?.length > 0) && (
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h6 className="card-title mb-3">Contact Information</h6>

                                    {contact.phones?.map((phone, index) => (
                                        <div className="mb-2" key={`phone-${index}`}>
                                            <a href={`tel:${phone.phone}`} className="text-decoration-none">
                                                📱 {phone.phone}
                                            </a>
                                            <div className="text-muted small ms-4">{phone.label}</div>
                                        </div>
                                    ))}

                                    {contact.emails?.map((email, index) => (
                                        <div className="mb-2" key={`email-${index}`}>
                                            <a href={`mailto:${email.email}`} className="text-decoration-none">
                                                ✉️ {email.email}
                                            </a>
                                            <div className="text-muted small ms-4">{email.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}

export default ContactDetailModal;
