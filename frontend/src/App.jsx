import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
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

                {/* Protected Favorites */}
                <Route
                    path="/favorites"
                    element={
                        <ProtectedRoute>
                            <Favorites />
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