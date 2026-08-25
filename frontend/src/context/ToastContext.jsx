import { useCallback, useState } from "react";
import { ToastContext } from "./toast-context.js";

let nextId = 1;
const LEAVE_ANIMATION_MS = 200;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((current) =>
            current.map((toast) =>
                toast.id === id ? { ...toast, leaving: true } : toast
            )
        );

        setTimeout(() => removeToast(id), LEAVE_ANIMATION_MS);
    }, [removeToast]);

    const showToast = useCallback((message, variant = "success") => {
        const id = nextId++;

        setToasts((current) => [...current, { id, message, variant, leaving: false }]);

        setTimeout(() => dismissToast(id), 3000);
    }, [dismissToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div
                className="toast-container position-fixed bottom-0 end-0 p-3"
                style={{ zIndex: 1080 }}
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast show align-items-center text-bg-${toast.variant} border-0 mb-2 ${
                            toast.leaving ? "toast-leave" : "toast-enter"
                        }`}
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        <div className="d-flex">
                            <div className="toast-body">
                                {toast.message}
                            </div>

                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                aria-label="Close"
                                onClick={() => dismissToast(toast.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
