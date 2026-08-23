import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddContact from "./pages/AddContact";
import EditContact from "./pages/EditContact";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Authentication */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Profile */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Add Contact */}
                <Route
                    path="/contacts/new"
                    element={
                        <ProtectedRoute>
                            <AddContact />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Edit Contact */}
                <Route
                    path="/contacts/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditContact />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown route */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;