const PALETTE = [
    "#4361ee", "#7209b7", "#f72585", "#e63946",
    "#f77f00", "#2a9d8f", "#0077b6", "#6d597a",
    "#3a86ff", "#8338ec", "#43aa8b", "#577590",
];

function initialsOf(firstName, lastName) {
    const first = firstName?.trim()?.[0] || "";
    const last = lastName?.trim()?.[0] || "";
    return (first + last).toUpperCase() || "?";
}

function colorFor(seed) {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return PALETTE[Math.abs(hash) % PALETTE.length];
}

function Avatar({ firstName, lastName, size = 40 }) {
    const initials = initialsOf(firstName, lastName);
    const background = colorFor(`${firstName || ""}${lastName || ""}`);

    return (
        <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0 text-white fw-semibold"
            style={{
                width: size,
                height: size,
                backgroundColor: background,
                fontSize: size * 0.4,
            }}
            aria-hidden="true"
        >
            {initials}
        </div>
    );
}

export default Avatar;
