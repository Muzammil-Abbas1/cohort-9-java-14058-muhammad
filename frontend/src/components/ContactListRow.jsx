import Avatar from "./Avatar";

function ContactListRow({ contact, onClick, onToggleFavorite }) {
    const subtext =
        contact.phones?.[0]?.phone ||
        contact.emails?.[0]?.email ||
        contact.title ||
        "";

    return (
        <button
            type="button"
            className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3"
            onClick={onClick}
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

            <span
                role="button"
                tabIndex={0}
                className="fs-5 flex-shrink-0"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite();
                    }
                }}
                aria-label={
                    contact.favorite ? "Remove from favorites" : "Add to favorites"
                }
                title={
                    contact.favorite ? "Remove from favorites" : "Add to favorites"
                }
            >
                {contact.favorite ? "⭐" : "☆"}
            </span>
        </button>
    );
}

export default ContactListRow;
