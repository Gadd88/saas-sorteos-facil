// src/pages/Dashboard.tsx
import { useAuth } from "@/hooks/useAuth";
import { raffleService } from "@/services/raffle-services";
import type { Raffle } from "@/types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components";

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout, loading: authLoading } = useAuth();
    const [raffles, setRaffles] = useState<Raffle[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRaffle, setSelectedRaffle] = useState<{ id: Raffle['id']; title: Raffle['title'] } | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/login");
            return;
        }
        loadRaffles();
    }, [user, authLoading]);

    const loadRaffles = async () => {
        if (!user) return;
        const data = await raffleService.getUserRaffles(user.uid);
        setRaffles(data);
        setLoading(false);
    };

    // const handleToggleStatus = async (
    //     raffleId: string,
    //     currentStatus: boolean
    // ) => {
    //     const action = currentStatus ? "desactiva" : "activa";
    //     try {
    //         toast.promise(raffleService.toggleRaffleStatus(raffleId, currentStatus), {
    //           loading: "Pausando sorteo...",
    //           success: <b>Sorteo {action}do exitosamente</b>,
    //           error: <b>Error al {action} el sorteo.</b>,
    //         });
    //         await loadRaffles(); // Recargar lista
    //     } catch (error) {
    //         toast.error("Error al cambiar el estado del sorteo" + (error as Error).message);
    //     }
    // };

    const handleDelete = async (raffleId: string, raffleTitle: string) => {
        setSelectedRaffle({ id: raffleId, title: raffleTitle });
        setModalOpen(true);
    }
    const confirmDelete = async () => {
        if (!selectedRaffle) return;
        const { id: raffleId } = selectedRaffle;
        setModalOpen(false);
        try {
            toast.promise(raffleService.deleteRaffle(raffleId), {
                loading: "Eliminando...",
                success: <b>"Sorteo eliminado exitosamente"</b>,
                error: <b>Error al eliminar el sorteo.</b>,
            });
            await loadRaffles(); // Recargar lista
        } catch (error) {
            toast.error(
                "Error al eliminar el sorteo. " + (error as Error).message
            );
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Mis Sorteos</h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-gray-600">{user?.email}</span>
                        <button
                            onClick={logout}
                            className="text-red-600 hover:underline"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Tienes {raffles.length} sorteo(s)
                    </h2>
                    <Link
                        to="/dashboard/new"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        + Nuevo Sorteo
                    </Link>
                </div>

                {raffles.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">🎟️</div>
                        <h3 className="text-2xl font-bold mb-2">
                            No tienes sorteos aún
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Crea tu primer sorteo y empieza a vender números
                        </p>
                        <Link
                            to="/dashboard/new"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Crear Mi Primer Sorteo
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {raffles.map((raffle) => (
                            <div
                                key={raffle.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition"
                            >
                                {/* Contenido del sorteo */}
                                <Link
                                    to={`/dashboard/raffle/${raffle.id}`}
                                    className="block p-6 pb-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg flex-1">
                                            {raffle.title}
                                        </h3>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                raffle.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {raffle.isActive
                                                ? "● Activo"
                                                : "○ Inactivo"}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {raffle.description}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Premio:{" "}
                                        <span className="font-medium">
                                            {raffle.prizeDescription}
                                        </span>
                                    </p>
                                </Link>

                                {/* Botones de acción */}
                                <div className="border-t px-6 py-3 flex gap-2">
                                    <Link
                                        to={`/dashboard/raffle/${raffle.id}`}
                                        className="flex-1 py-2 text-center bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                                    >
                                        Gestionar
                                    </Link>
                                    {/* <button
                                        onClick={() =>
                                            handleToggleStatus(
                                                raffle.id,
                                                raffle.isActive
                                            )
                                        }
                                        className={`flex-1 py-2 text-center rounded text-sm font-medium ${
                                            raffle.isActive
                                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                : "bg-green-100 text-green-800 hover:bg-green-200"
                                        }`}
                                    >
                                        {raffle.isActive ? "Pausar" : "Activar"}
                                    </button> */}
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                raffle.id,
                                                raffle.title
                                            )
                                        }
                                        className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm font-medium"
                                        title="Eliminar sorteo"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={modalOpen}
                title="Confirmar eliminación"
                message={`¿Seguro que deseas eliminar el sorteo "${selectedRaffle?.title}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={confirmDelete}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
};
