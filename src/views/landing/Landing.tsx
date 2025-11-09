// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white">
                <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-center sm:text-left">
                        🎟️ Sorteos Fácil
                    </div>

                    {/* Links */}
                    <div className="flex flex-row items-center gap-3 sm:gap-4">
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition w-full sm:w-auto text-center"
                            >
                                Mi Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:underline text-gray-200 font-medium text-center w-full sm:w-auto"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-blue-600 p-2 rounded-lg font-semibold hover:bg-gray-100 transition w-full sm:w-auto text-center"
                                >
                                    Registrarse Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Crea Sorteos Online en Minutos
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        La forma más simple de organizar rifas y sorteos con 100
                        números. Sin complicaciones, 100% online.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition"
                    >
                        Crear Mi Primer Sorteo 🚀
                    </Link>
                    <p className="mt-4 text-blue-200">
                        Gratis • Sin tarjeta de crédito • 2 minutos
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-4xl font-bold text-center mb-16">
                    ¿Cómo funciona?
                </h2>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">1️⃣</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                            Crea tu Sorteo
                        </h3>
                        <p className="text-gray-600">
                            Regístrate, completa los datos de tu sorteo (título,
                            premio, precio) y obtén tu link personalizado en
                            segundos.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">2️⃣</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                            Comparte el Link
                        </h3>
                        <p className="text-gray-600">
                            Los participantes eligen su número, completan sus
                            datos y te contactan automáticamente por WhatsApp
                            para coordinar el pago.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">3️⃣</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                            Gestiona Todo
                        </h3>
                        <p className="text-gray-600">
                            Marca números como vendidos, ve estadísticas en
                            tiempo real y exporta la lista de participantes
                            cuando quieras.
                        </p>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Ventajas de SorteosFácil
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className="text-3xl">✅</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">
                                    100% Online
                                </h3>
                                <p className="text-gray-600">
                                    No necesitas planillas ni grupos de WhatsApp
                                    desorganizados. Todo en un solo lugar.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-3xl">⚡</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">
                                    Tiempo Real
                                </h3>
                                <p className="text-gray-600">
                                    Los números se actualizan automáticamente.
                                    Sin confusiones ni números duplicados.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-3xl">📱</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">
                                    WhatsApp Integrado
                                </h3>
                                <p className="text-gray-600">
                                    Los compradores te contactan directamente
                                    con toda su información ya cargada.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-3xl">📊</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">
                                    Estadísticas Claras
                                </h3>
                                <p className="text-gray-600">
                                    Ve cuántos números vendiste, cuánto
                                    recaudaste y exporta los datos cuando
                                    quieras.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-3xl">🎨</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">
                                    Tu Marca
                                </h3>
                                <p className="text-gray-600">
                                    Personaliza el título, descripción y URL de
                                    tu sorteo para que sea único.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-3xl">🔒</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">
                                    Seguro y Privado
                                </h3>
                                <p className="text-gray-600">
                                    Solo tú puedes gestionar tus sorteos. Los
                                    datos están protegidos en Firebase.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-8">Precios Simples</h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Sin sorpresas. Sin costos ocultos.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Plan Gratis */}
                        <div className="border-2 rounded-lg p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                Plan Gratis
                            </h3>
                            <div className="text-5xl font-bold mb-6">$0</div>
                            <ul className="text-left space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>3
                                    Sorteos activos
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    100 números por sorteo
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    WhatsApp integrado
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Estadísticas básicas
                                </li>
                            </ul>
                            <Link
                                to="/register"
                                className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50"
                            >
                                Empezar Gratis
                            </Link>
                        </div>

                        {/* Plan Premium */}
                        <div className="border-2 border-blue-600 rounded-lg p-8 relative bg-blue-50">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Próximamente
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                Plan Premium
                            </h3>
                            <div className="text-5xl font-bold mb-6">
                                $X<span className="text-xl">/mes</span>
                            </div>
                            <ul className="text-left space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Sorteos ilimitados
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Personalización completa
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Notificaciones por email
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Soporte prioritario
                                </li>
                            </ul>
                            <button
                                disabled
                                className="block w-full py-3 bg-gray-400 text-white rounded-lg font-bold cursor-not-allowed"
                            >
                                Próximamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        ¿Listo para organizar tu sorteo?
                    </h2>
                    <p className="text-xl mb-8">
                        Únete a cientos de organizadores que ya confían en
                        SorteosFácil
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition"
                    >
                        Crear Mi Sorteo Ahora
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>
                        &copy; {new Date().getFullYear()} Sorteos Fácil. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};
