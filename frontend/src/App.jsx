import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddContact from "./pages/AddContact";
import EditContact from "./pages/EditContact";
import Profile from "./pages/Profile";

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

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                {/* Profile */}
                <Route
                     path="/profile"
                   element={<Profile />}
                  />

                {/* Contacts */}
                <Route
                    path="/contacts/new"
                    element={<AddContact />}
                />

                {/* Unknown route */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
                <Route
                   path="/contacts/edit/:id"
                   element={<EditContact />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;