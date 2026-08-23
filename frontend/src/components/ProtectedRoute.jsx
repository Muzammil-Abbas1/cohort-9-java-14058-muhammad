import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await api.get("/auth/me");
                setAuthenticated(true);
            } catch {
                setAuthenticated(false);
            } finally {
                setChecking(false);
            }
        };

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

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;