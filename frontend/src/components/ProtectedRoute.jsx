import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const checkAuthentication = async () => {
        setChecking(true);
        setLoadError(false);

        try {
            await api.get("/auth/me");
            setAuthenticated(true);
        } catch (err) {
            const status = err.response?.status;

            if (status === 401 || status === 403) {
                setAuthenticated(false);
            } else {
                // Network failure or server error -- not proof the
                // session is invalid, so don't redirect a valid user
                // to /login over a transient problem.
                setLoadError(true);
            }
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    if (checking) {
        return (
            <div className="text-center mt-5">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Checking authentication...
                    </span>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="text-center mt-5">
                <p className="text-danger mb-3">
                    Couldn't reach the server. Check your connection and try again.
                </p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={checkAuthentication}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
