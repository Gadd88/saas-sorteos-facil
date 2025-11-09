// src/App.tsx
import {
    CreateRaffleView,
    Dashboard,
    Landing,
    Login,
    ManageRaffleView,
    PublicRaffleView,
    Register,
} from "@/views";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Toaster } from "react-hot-toast";

// Pages

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Públicas */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/s/:slug" element={<PublicRaffleView />} />

                {/* Protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/new"
                    element={
                        <ProtectedRoute>
                            <CreateRaffleView />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/raffle/:id"
                    element={
                        <ProtectedRoute>
                            <ManageRaffleView />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
        </BrowserRouter>
    );
};
