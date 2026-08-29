import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AppShell from "../components/AppShell";
import FavoriteContactCard from "../components/FavoriteContactCard";
import ContactDetailModal from "../components/ContactDetailModal";
import ContactFormModal from "../components/ContactFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useToast } from "../context/useToast.js";

function Favorites() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [viewingContact, setViewingContact] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadFavorites = async (signal) => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/contacts?favoritesOnly=true&page=${page}&size=12&sort=lastName,asc`,
                { signal }
            );

            setContacts(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);

        } catch (err) {
            if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
                return;
            }

            console.error(
                "Failed to load favorites:",
                err.response?.status,
                err.code
            );

            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.error ||
                "Failed to load favorites."
            );
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        loadFavorites(controller.signal);
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if (totalPages > 0 && page >= totalPages) {
            setPage(totalPages - 1);
        }
    }, [page, totalPages]);

    const handleToggleFavorite = async (contact) => {
        try {
            await api.patch(`/contacts/${contact.id}/favorite`);
            setViewingContact(null);
            await loadFavorites();
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

    const handleEditContact = (contact) => {
        setViewingContact(null);
        setEditingContact(contact);
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setEditingContact(null);
    };

    const handleContactSaved = async () => {
        setShowFormModal(false);
        setEditingContact(null);
        showToast("Contact updated successfully");
        await loadFavorites();
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
            await loadFavorites();
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

    return (
        <AppShell
            active="favorites"
            title="Favorites"
            subtitle={`${totalElements} favorite contact${totalElements === 1 ? "" : "s"}`}
        >

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {loading && (
                <div className="text-center py-5" aria-busy="true" aria-live="polite">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading favorites...</span>
                    </div>
                </div>
            )}

            {!loading && !error && contacts.length === 0 && (
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <h4>No favorites yet</h4>
                        <p className="text-muted">
                            Star a contact from your list to see it here.
                        </p>
                    </div>
                </div>
            )}

            {!loading && contacts.length > 0 && (
                <div className="row content-fade-in">
                    {contacts.map((contact) => (
                        <FavoriteContactCard
                            key={contact.id}
                            contact={contact}
                            onClick={() => setViewingContact(contact)}
                            onToggleFavorite={() => handleToggleFavorite(contact)}
                        />
                    ))}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                    <span className="text-muted small">
                        Page {page + 1} of {totalPages}
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

            <ContactDetailModal
                contact={viewingContact}
                onClose={() => setViewingContact(null)}
                onEdit={handleEditContact}
                onDelete={handleDeleteClick}
                onToggleFavorite={handleToggleFavorite}
            />

            <ContactFormModal
                show={showFormModal}
                contact={editingContact}
                onClose={closeFormModal}
                onSaved={handleContactSaved}
            />

            <DeleteConfirmModal
                contact={contactToDelete}
                deleting={deleting}
                onCancel={closeDeleteModal}
                onConfirm={confirmDelete}
            />

        </AppShell>
    );
}

export default Favorites;
