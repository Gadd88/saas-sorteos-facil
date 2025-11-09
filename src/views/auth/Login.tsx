// src/pages/Login.tsx
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            setError((error as Error).message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/dashboard");
        } catch (error) {
            setError((error as Error).message || "Error al iniciar sesión con Google");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
                <Link
                    to={"/"}
                    className="p-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 mb-4 inline-block"
                >
                    Volver al Inicio
                </Link>
                <h1 className="text-3xl font-bold text-center my-8">
                    Iniciar Sesión
                </h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Iniciando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            O continúa con
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 border-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Google
                </button>

                <p className="text-center mt-6 text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};
