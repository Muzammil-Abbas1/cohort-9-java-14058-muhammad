import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ContactFormModal from "../components/ContactFormModal";
import ContactDetailModal from "../components/ContactDetailModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ContactListRow from "../components/ContactListRow";
import SkeletonListRow from "../components/SkeletonListRow";
import AppShell from "../components/AppShell";
import { useToast } from "../context/useToast.js";

function Dashboard() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [sortField, setSortField] = useState("lastName,asc");
    const [favoritesFirst, setFavoritesFirst] = useState(false);

    const [showFormModal, setShowFormModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    const [viewingContact, setViewingContact] = useState(null);

    const [contactToDelete, setContactToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const handleAddContact = () => {
        setEditingContact(null);
        setShowFormModal(true);
    };

    const handleEditContact = (contact) => {
        setViewingContact(null);
        setEditingContact(contact);
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        if (!showFormModal) {
            return;
        }
        setShowFormModal(false);
        setEditingContact(null);
    };

    const handleContactSaved = async () => {
        const wasEditing = Boolean(editingContact);

        setShowFormModal(false);
        setEditingContact(null);

        showToast(
            wasEditing
                ? "Contact updated successfully"
                : "Contact added successfully"
        );

        await loadContacts();
    };

    const handleToggleFavorite = async (contact) => {
        try {
            const response = await api.patch(
                `/contacts/${contact.id}/favorite`
            );

            setContacts((current) =>
                current.map((c) =>
                    c.id === contact.id ? response.data : c
                )
            );

            setViewingContact((current) =>
                current?.id === contact.id ? response.data : current
            );
        } catch (err) {
            console.error(
                "Failed to toggle favorite:",
                err.response?.status,
                err.code
            );

            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.error ||
                "Failed to update favorite."
            );
        }
    };

    const handleDeleteClick = (contact) => {
        setViewingContact(null);
        setContactToDelete(contact);
    };

    const closeDeleteModal = () => {
        if (!deleting) {
            setContactToDelete(null);
        }
    };

    const confirmDelete = async () => {
        if (!contactToDelete) {
            return;
        }

        setDeleting(true);

        try {
            await api.delete(`/contacts/${contactToDelete.id}`);

            setContactToDelete(null);
            showToast("Contact deleted successfully");
            await loadContacts();

        } catch (err) {
            console.error(
                "Failed to delete contact:",
                err.response?.status,
                err.code
            );

            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.error ||
                "Failed to delete contact."
            );
            setContactToDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const buildSortParams = () => {
        const params = new URLSearchParams();

        if (favoritesFirst) {
            params.append("sort", "favorite,desc");
        }

        params.append("sort", sortField);

        return params.toString();
    };

    const loadContacts = async (signal) => {
        try {
            setLoading(true);
            setError("");

            const sortParams = buildSortParams();

            const endpoint = searchTerm.trim()
                ? `/contacts/search?name=${encodeURIComponent(searchTerm)}&page=${page}&size=9&${sortParams}`
                : `/contacts?page=${page}&size=9&${sortParams}`;

            const response = await api.get(endpoint, { signal });

            setContacts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);

        } catch (err) {
            if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
                return;
            }

            console.error(
                "Failed to load contacts:",
                err.response?.status,
                err.code
            );

            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.error ||
                "Failed to load contacts."
            );
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleSortChange = (e) => {
        setSortField(e.target.value);
        setPage(0);
    };

    const handleFavoritesFirstChange = (e) => {
        setFavoritesFirst(e.target.checked);
        setPage(0);
    };

    useEffect(() => {
        const controller = new AbortController();

        const delay = setTimeout(() => {
            loadContacts(controller.signal);
        }, 400);

        return () => {
            clearTimeout(delay);
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, page, sortField, favoritesFirst]);

    useEffect(() => {
        if (totalPages > 0 && page >= totalPages) {
            setPage(totalPages - 1);
        }
    }, [page, totalPages]);

    // Alphabetical section headers only make sense when the list is
    // actually ordered by last name -- otherwise "A" could reappear
    // after "B" and look broken.
    const groupedContacts = useMemo(() => {
        if (sortField !== "lastName,asc") {
            return [{ letter: null, items: contacts }];
        }

        const groups = [];
        let currentLetter = null;

        contacts.forEach((contact) => {
            const letter = (contact.lastName?.[0] || "#").toUpperCase();

            if (letter !== currentLetter) {
                groups.push({ letter, items: [] });
                currentLetter = letter;
            }

            groups[groups.length - 1].items.push(contact);
        });

        return groups;
    }, [contacts, sortField]);

    return (
        <AppShell
            active="contacts"
            title="All Contacts"
           
            onAddContact={handleAddContact}
        >

            {/* ================= TOOLBAR ================= */}

            <div className="row g-2 mb-4">

                <div className="col-12 col-lg-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="col-12 col-md-8 col-lg-4">
                    <select
                        className="form-select"
                        value={sortField}
                        onChange={handleSortChange}
                        aria-label="Sort contacts"
                    >
                        <option value="lastName,asc">Last Name (A-Z)</option>
                        <option value="firstName,asc">First Name (A-Z)</option>
                        <option value="createdAt,desc">Recently Added</option>
                    </select>
                </div>

                <div className="col-12 col-md-4 col-lg-3 d-flex align-items-center">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="favorites-first"
                            checked={favoritesFirst}
                            onChange={handleFavoritesFirstChange}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="favorites-first"
                        >
                            Favorites first
                        </label>
                    </div>
                </div>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* ================= LOADING ================= */}

            {loading && (
                <div
                    className="list-group shadow-sm"
                    aria-busy="true"
                    aria-live="polite"
                >
                    <span className="visually-hidden">Loading contacts...</span>

                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonListRow key={index} />
                    ))}
                </div>
            )}

            {/* ================= EMPTY STATE ================= */}

            {!loading && !error && contacts.length === 0 && (
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <h4>
                            {searchTerm ? "No matches found" : "No contacts yet"}
                        </h4>

                        <p className="text-muted">
                            {searchTerm
                                ? "Try a different search term."
                                : "You haven't added any contacts yet."}
                        </p>

                        {!searchTerm && (
                            <button
                                className="btn btn-primary"
                                onClick={handleAddContact}
                            >
                                Add Your First Contact
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ================= CONTACT LIST ================= */}

            {!loading && contacts.length > 0 && groupedContacts.map((group) => (
                <div key={group.letter || "all"} className="mb-3">

                    {group.letter && (
                        <div className="text-primary fw-bold small mb-1 ps-1">
                            {group.letter}
                        </div>
                    )}

                    <div className="list-group shadow-sm">
                        {group.items.map((contact) => (
                            <ContactListRow
                                key={contact.id}
                                contact={contact}
                                onClick={() => setViewingContact(contact)}
                                onToggleFavorite={() => handleToggleFavorite(contact)}
                            />
                        ))}
                    </div>

                </div>
            ))}

            {!loading && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4 mb-4">

                    <span className="text-muted small">
                        Showing page {page + 1} of {totalPages}{" "}
                        ({totalElements} total contacts)
                    </span>

                    <div>
                        <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </button>

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>

                </div>
            )}

            {/* ================= ADD / EDIT CONTACT MODAL ================= */}

            <ContactFormModal
                show={showFormModal}
                contact={editingContact}
                onClose={closeFormModal}
                onSaved={handleContactSaved}
            />

            {/* ================= CONTACT DETAIL MODAL ================= */}

            <ContactDetailModal
                contact={viewingContact}
                onClose={() => setViewingContact(null)}
                onEdit={handleEditContact}
                onDelete={handleDeleteClick}
                onToggleFavorite={handleToggleFavorite}
            />

            {/* ================= DELETE CONFIRMATION MODAL ================= */}

            <DeleteConfirmModal
                contact={contactToDelete}
                deleting={deleting}
                onCancel={closeDeleteModal}
                onConfirm={confirmDelete}
            />

        </AppShell>
    );
}

export default Dashboard;
