import Avatar from "./Avatar";

function FavoriteContactCard({ contact, onClick, onToggleFavorite }) {
    const primaryLabel = contact.emails?.[0]?.label || contact.phones?.[0]?.label;

    const handleCardKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div className="col-6 col-md-4 col-lg-3 mb-3">
            <div
                role="button"
                tabIndex={0}
                className="card h-100 shadow-sm w-100 text-center p-3 position-relative"
                onClick={onClick}
                onKeyDown={handleCardKeyDown}
            >
                <button
                    type="button"
                    className="btn p-0 border-0 bg-transparent position-absolute top-0 end-0 m-2 fs-5"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
                >
                    ⭐
                </button>

                <div className="d-flex justify-content-center mb-2">
                    <Avatar
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        size={64}
                    />
                </div>

                <div className="fw-semibold text-truncate">
                    {contact.firstName} {contact.lastName}
                </div>

                {contact.title && (
                    <div className="text-primary small text-truncate">
                        {contact.title}
                    </div>
                )}

                {primaryLabel && (
                    <div className="mt-2">
                        <span className="badge rounded-pill text-bg-primary-subtle text-primary-emphasis">
                            {primaryLabel}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavoriteContactCard;
