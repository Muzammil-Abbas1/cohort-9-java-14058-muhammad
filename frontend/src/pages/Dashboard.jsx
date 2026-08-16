import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const handleAddContact = () => {
        navigate("/contacts/new");
    };

   {/*=======================deleting contact=====================*/}

    const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this contact?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await api.delete(`/contacts/${id}`);

        setContacts((currentContacts) =>
            currentContacts.filter(
                (contact) => contact.id !== id
            )
        );

    } catch (err) {
        console.error("Failed to delete contact:", err);

        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        setError(
            err.response?.data?.error ||
            "Failed to delete contact."
        );
    }
};



    const loadContacts = async () => {
    try {
        setLoading(true);
        setError("");

        const endpoint = searchTerm.trim()
            ? `/contacts/search?name=${encodeURIComponent(searchTerm)}&page=${page}&size=9`
            : `/contacts?page=${page}&size=9`;

        const response = await api.get(endpoint);

        setContacts(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
    } catch (err) {
        console.error("Failed to load contacts:", err);

        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        setError(
            err.response?.data?.error ||
            "Failed to load contacts."
        );
    } finally {
        setLoading(false);
    }
    };
    
    const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
    };

    useEffect(() => {
    const delay = setTimeout(() => {
        loadContacts();
    }, 400);

    return () => clearTimeout(delay);
   }, [searchTerm, page]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container-fluid">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
                <span className="navbar-brand">
                    Contact Management System
                </span>

                <div className="ms-auto d-flex gap-2">

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
                <div className="mb-4">
                  <input
                    type="text"
                     className="form-control"
                      placeholder="Search contacts by first or last name..."
                      value={searchTerm}
                   onChange={handleSearchChange}
                 />
              </div>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* ================= LOADING ================= */}

                {loading && (
                    <div className="text-center mt-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="mt-2">
                            Loading contacts...
                        </p>

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

                                        <h5 className="card-title">
                                            {contact.firstName}{" "}
                                            {contact.lastName}
                                        </h5>

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
                                             onClick={() => navigate(`/contacts/edit/${contact.id}`)}
                                             >
                                               Edit
                                               </button>

                                            <button
                                           className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(contact.id)}
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

        </div>
    );
}

export default Dashboard;