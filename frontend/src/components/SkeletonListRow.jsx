function SkeletonListRow() {
    return (
        <div className="list-group-item d-flex align-items-center gap-3 py-3" aria-hidden="true">
            <span className="skeleton skeleton-circle flex-shrink-0" style={{ width: 44, height: 44 }} />

            <div className="flex-grow-1">
                <span className="skeleton skeleton-text mb-2" style={{ width: "35%", height: "0.95rem" }} />
                <span className="skeleton skeleton-text" style={{ width: "55%", height: "0.8rem" }} />
            </div>

            <span className="skeleton skeleton-text" style={{ width: "1.1rem", height: "1.1rem" }} />
        </div>
    );
}

export default SkeletonListRow;
