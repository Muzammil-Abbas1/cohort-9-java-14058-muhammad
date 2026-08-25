function SkeletonCard() {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm" aria-hidden="true">
                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="skeleton skeleton-text" style={{ width: "60%", height: "1.25rem" }} />
                        <span className="skeleton skeleton-text" style={{ width: "1.1rem", height: "1.1rem" }} />
                    </div>

                    <div className="mb-3">
                        <span className="skeleton skeleton-text mb-2" style={{ width: "30%", height: "0.8rem" }} />
                        <span className="skeleton skeleton-text" style={{ width: "70%", height: "0.8rem" }} />
                    </div>

                    <div className="mb-3">
                        <span className="skeleton skeleton-text mb-2" style={{ width: "30%", height: "0.8rem" }} />
                        <span className="skeleton skeleton-text" style={{ width: "50%", height: "0.8rem" }} />
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <span className="skeleton skeleton-btn" />
                        <span className="skeleton skeleton-btn" />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SkeletonCard;
