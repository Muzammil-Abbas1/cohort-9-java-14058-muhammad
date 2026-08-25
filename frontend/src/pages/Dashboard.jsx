import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ContactFormModal from "../components/ContactFormModal";
import ThemeToggle from "../components/ThemeToggle";
import SkeletonCard from "../components/SkeletonCard";
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

    const [sortField, setSortField] = useState("createdAt,desc");
    const [favoritesFirst, setFavoritesFirst] = useState(false);

    const [showFormModal, setShowFormModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    const [contactToDelete, setContactToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const handleAddContact = () => {
        setEditingContact(null);
        setShowFormModal(true);
    };

    const handleEditContact = (contact) => {
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

   {/*=======================deleting contact=====================*/}

    const handleDeleteClick = (contact) => {
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

        const response = await api.get(endpoint, {
            signal,
        });

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
   }, [searchTerm, page, sortField, favoritesFirst]);

   useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
        setPage(totalPages - 1);
    }
   }, [page, totalPages]);


    const handleLogout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (err) {
        console.error(
            "Logout failed:",
            err.response?.status,
            err.code
        );
      } finally {
          navigate("/login");
      }
   };

    return (
        <div className="container-fluid">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
                <span className="navbar-brand">
                    Contact Management System
                </span>

                <div className="ms-auto d-flex gap-2">

                       <ThemeToggle />

                       <button
                       className="btn btn-outline-light"
                             onClick={() => navigate("/profile")}
                        >
                          Profile
                        </button>

                         <button
                         className="btn btn-light"
                        onClick={handleLogout}
                       >
                       Logout
                     </button>

              </div>
            </nav>

            {/* ================= MAIN CONTENT ================= */}

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h2>My Contacts</h2>

                        <p className="text-muted mb-0">
                            Manage your contacts
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleAddContact}
                    >
                        + Add Contact
                    </button>

                </div>
                <div className="row g-2 mb-4">

                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search contacts by first or last name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={sortField}
                            onChange={handleSortChange}
                            aria-label="Sort contacts"
                        >
                            <option value="createdAt,desc">Recently Added</option>
                            <option value="firstName,asc">First Name (A-Z)</option>
                            <option value="lastName,asc">Last Name (A-Z)</option>
                        </select>
                    </div>

                    <div className="col-md-3 d-flex align-items-center">
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
                    <div className="row" aria-busy="true" aria-live="polite">
                        <span className="visually-hidden">
                            Loading contacts...
                        </span>

                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                )}

                {/* ================= EMPTY STATE ================= */}

                {!loading && !error && contacts.length === 0 && (
                <div className="card shadow-sm">

                  <div className="card-body text-center py-5">

                  <h4>
                     {searchTerm
                         ? "No matches found"
                       : "No contacts yet"}
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

                {/* ================= CONTACTS ================= */}

                {!loading && contacts.length > 0 && (
                    <div className="row">

                        {contacts.map((contact) => (
                            <div
                                className="col-md-6 col-lg-4 mb-4"
                                key={contact.id}
                            >

                                <div className="card h-100 shadow-sm">

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-start">

                                            <h5 className="card-title">
                                                {contact.firstName}{" "}
                                                {contact.lastName}
                                            </h5>

                                            <button
                                                type="button"
                                                className="btn btn-sm p-0 border-0 bg-transparent fs-5"
                                                onClick={() =>
                                                    handleToggleFavorite(contact)
                                                }
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
                                            <p className="text-muted">
                                                {contact.title}
                                            </p>
                                        )}

                                        {/* ================= EMAILS ================= */}

                                        {contact.emails?.length > 0 && (
                                            <div className="mb-3">

                                                <strong>
                                                    Email
                                                </strong>

                                                {contact.emails.map(
                                                    (email, index) => (
                                                        <div
                                                            key={index}
                                                            className="small"
                                                        >
                                                            {email.email}

                                                            <span className="text-muted ms-2">
                                                                ({email.label})
                                                            </span>
                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                        {/* ================= PHONES ================= */}

                                        {contact.phones?.length > 0 && (
                                            <div className="mb-3">

                                                <strong>
                                                    Phone
                                                </strong>

                                                {contact.phones.map(
                                                    (phone, index) => (
                                                        <div
                                                            key={index}
                                                            className="small"
                                                        >
                                                            {phone.phone}

                                                            <span className="text-muted ms-2">
                                                                ({phone.label})
                                                            </span>
                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                        {/* ================= ACTIONS ================= */}

                                        <div className="mt-3">

                                            <button
                                             className="btn btn-sm btn-outline-primary me-2"
                                             onClick={() => handleEditContact(contact)}
                                             >
                                               Edit
                                               </button>

                                            <button
                                           className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteClick(contact)}
                                              >
                                             Delete
                                             </button>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}
                {!loading && totalPages > 1 && (
    <div className="d-flex justify-content-between align-items-center mt-4 mb-4">

        <span className="text-muted">
            Showing page {page + 1} of {totalPages}{" "}
            ({totalElements} total contacts)
        </span>

        <div>
            <button
                className="btn btn-outline-secondary me-2"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
            >
                Previous
            </button>

            <button
                className="btn btn-outline-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
            >
                Next
            </button>
        </div>

    </div>
          )}

            </div>

            {/* ================= ADD / EDIT CONTACT MODAL ================= */}

            <ContactFormModal
                show={showFormModal}
                contact={editingContact}
                onClose={closeFormModal}
                onSaved={handleContactSaved}
            />

            {/* ================= DELETE CONFIRMATION MODAL ================= */}

            {contactToDelete && (

                <div
                    className="modal d-block"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-contact-title"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={closeDeleteModal}
                >

                    <div
                        className="modal-dialog modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5
                                    className="modal-title"
                                    id="delete-contact-title"
                                >
                                    Delete Contact
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={closeDeleteModal}
                                    disabled={deleting}
                                />

                            </div>

                            <div className="modal-body">
                                Are you sure you want to delete{" "}
                                <strong>
                                    {contactToDelete.firstName}{" "}
                                    {contactToDelete.lastName}
                                </strong>
                                ? This action cannot be undone.
                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeDeleteModal}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;