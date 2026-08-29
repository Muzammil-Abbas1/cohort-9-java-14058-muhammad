import Avatar from "./Avatar";

function ContactListRow({ contact, onClick, onToggleFavorite }) {
    const subtext =
        contact.phones?.[0]?.phone ||
        contact.emails?.[0]?.email ||
        contact.title ||
        "";

    const handleRowKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3"
            onClick={onClick}
            onKeyDown={handleRowKeyDown}
        >
            <Avatar
                firstName={contact.firstName}
                lastName={contact.lastName}
                size={44}
            />

            <div className="text-start flex-grow-1" style={{ minWidth: 0 }}>
                <div className="fw-semibold text-truncate">
                    {contact.firstName} {contact.lastName}
                </div>
                {subtext && (
                    <div className="text-muted small text-truncate">
                        {subtext}
                    </div>
                )}
            </div>

            <button
                type="button"
                className="btn p-0 border-0 bg-transparent fs-5 flex-shrink-0"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                aria-label={
                    contact.favorite ? "Remove from favorites" : "Add to favorites"
                }
                title={
                    contact.favorite ? "Remove from favorites" : "Add to favorites"
                }
            >
                {contact.favorite ? "⭐" : "☆"}
            </button>
        </div>
    );
}

export default ContactListRow;
