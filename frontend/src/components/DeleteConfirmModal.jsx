function DeleteConfirmModal({ contact, deleting, onCancel, onConfirm }) {
    if (!contact) {
        return null;
    }

    return (
        <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-contact-title"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={onCancel}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title" id="delete-contact-title">
                            Delete Contact
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onCancel}
                            disabled={deleting}
                        />
                    </div>

                    <div className="modal-body">
                        Are you sure you want to delete{" "}
                        <strong>
                            {contact.firstName} {contact.lastName}
                        </strong>
                        ? This action cannot be undone.
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={deleting}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={onConfirm}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
