// src/pages/ManageRaffle.tsx
import { NumberGrid } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { raffleService } from "@/services/raffle-services";
import type { Raffle, Ticket } from "@/types";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ManageRaffleView = () => {
    const { id } = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [raffle, setRaffle] = useState<Raffle | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState({
        disponible: 0,
        reservado: 0,
        vendido: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/login");
            return;
        }
        loadRaffleData();
    }, [id, user, authLoading]);

    const loadRaffleData = async () => {
        if (!id || !user) return;

        try {
            const raffleData = await raffleService.getRaffle(id);

            if (!raffleData) {
                alert("Sorteo no encontrado");
                navigate("/dashboard");
                return;
            }

            if (raffleData.ownerId !== user?.uid) {
                alert("No tienes permiso para gestionar este sorteo");
                navigate("/dashboard");
                return;
            }

            setRaffle(raffleData);

            const ticketsData = await raffleService.getTickets(id);
            setTickets(ticketsData);

            // Calcular estadísticas
            const disponible = ticketsData.filter(
                (t) => t.status === "disponible"
            ).length;
            const reservado = ticketsData.filter(
                (t) => t.status === "reservado"
            ).length;
            const vendido = ticketsData.filter(
                (t) => t.status === "vendido"
            ).length;
            setStats({ disponible, reservado, vendido });
        } catch (error) {
            console.error("Error cargando sorteo:", error);
        } finally {
            setLoading(false);
        }
    };

    const copyPublicLink = () => {
        const link = `${window.location.origin}/s/${
            raffle?.slug || raffle?.id
        }`;
        navigator.clipboard.writeText(link);
        alert("¡Link copiado al portapapeles!");
    };

    const exportReservedNumbers = () => {
        const reservado = tickets.filter(
            (t) => t.status === "reservado" || t.status === "vendido"
        );
        const csv = ["Número,Nombre,Teléfono,Email,Estado"];

        reservado.forEach((ticket) => {
            csv.push(
                `${ticket.number},${ticket.buyerName},${ticket.buyerPhone},${
                    ticket.buyerEmail || ""
                },${ticket.status}`
            );
        });

        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sorteo-${raffle?.title}-numeros.csv`;
        a.click();
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando sesión...</p>
                </div>
            </div>
        );
    }
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando sorteo...</p>
                </div>
            </div>
        );
    }
    if (!raffle) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="text-blue-600 hover:underline mb-2"
                            >
                                ← Volver al Dashboard
                            </button>
                            <h1 className="text-3xl font-bold">
                                {raffle.title}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {raffle.description}
                            </p>
                        </div>
                        <button
                            onClick={copyPublicLink}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                        >
                            📋 Copiar Link Público
                        </button>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-green-600">
                            {stats.disponible}
                        </div>
                        <div className="text-gray-600">Disponibles</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-yellow-600">
                            {stats.reservado}
                        </div>
                        <div className="text-gray-600">Reservados</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-red-600">
                            {stats.vendido}
                        </div>
                        <div className="text-gray-600">Vendidos</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-3xl font-bold text-blue-600">
                            $
                            {(
                                (stats.reservado + stats.vendido) *
                                raffle.ticketPrice
                            ).toFixed(2)}
                        </div>
                        <div className="text-gray-600">Recaudado</div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Acciones</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={exportReservedNumbers}
                            className="px-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            📊 Exportar Números Reservados
                        </button>
                        <a
                            href={`${window.location.origin}/s/${
                                raffle.slug || raffle.id
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 md:px-6 md:py-3 border rounded-lg hover:bg-gray-50 text-center"
                        >
                            👁️ Ver como Público
                        </a>
                    </div>
                </div>

                {/* Instrucciones */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-blue-900 mb-2">
                        💡 Cómo gestionar tu sorteo:
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>
                            • <strong>Amarillo (Reservado)</strong>: El
                            comprador envió sus datos por WhatsApp. Haz clic
                            para marcar como vendido cuando confirmes el pago.
                        </li>
                        <li>
                            • <strong>Rojo (Vendido)</strong>: Pago confirmado.
                            Haz clic si necesitas liberar el número.
                        </li>
                        <li>
                            • <strong>Verde (Disponible)</strong>: Número libre
                            para la venta.
                        </li>
                    </ul>
                </div>

                {/* Grilla */}
                <div className="bg-white rounded-lg shadow p-6">
                    <NumberGrid
                        raffleId={raffle.id}
                        isOwner={true}
                        ownerWhatsApp={raffle.ownerWhatsApp}
                    />
                </div>

                {/* Lista de Reservados */}
                {stats.reservado > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mt-6">
                        <h2 className="text-xl font-bold mb-4">
                            Números Reservados Pendientes ({stats.reservado})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">
                                            Número
                                        </th>
                                        <th className="p-3 text-left">
                                            Nombre
                                        </th>
                                        <th className="p-3 text-left">
                                            Teléfono
                                        </th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets
                                        .filter((t) => t.status === "reservado")
                                        .map((ticket) => (
                                            <tr
                                                key={ticket.number}
                                                className="border-b"
                                            >
                                                <td className="p-3 font-bold">
                                                    {ticket.number}
                                                </td>
                                                <td className="p-3">
                                                    {ticket.buyerName}
                                                </td>
                                                <td className="p-3">
                                                    <a
                                                        href={`https://wa.me/${ticket.buyerPhone}`}
                                                        target="_blank"
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        {ticket.buyerPhone}
                                                    </a>
                                                </td>
                                                <td className="p-3">
                                                    {ticket.buyerEmail || "-"}
                                                </td>
                                                <td className="p-3">
                                                    {ticket.reservedAt
                                                        ? new Date(
                                                              ticket.reservedAt
                                                                  .seconds *
                                                                  1000
                                                          ).toLocaleString()
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Lista de Vendidos */}
                {stats.vendido > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mt-6">
                        <h2 className="text-xl font-bold mb-4">
                            Números Vendidos ({stats.vendido})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">
                                            Número
                                        </th>
                                        <th className="p-3 text-left">
                                            Nombre
                                        </th>
                                        <th className="p-3 text-left">
                                            Teléfono
                                        </th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets
                                        .filter((t) => t.status === "vendido")
                                        .map((ticket) => (
                                            <tr
                                                key={ticket.number}
                                                className="border-b"
                                            >
                                                <td className="p-3 font-bold">
                                                    {ticket.number}
                                                </td>
                                                <td className="p-3">
                                                    {ticket.buyerName}
                                                </td>
                                                <td className="p-3">
                                                    <a
                                                        href={`https://wa.me/${ticket.buyerPhone}`}
                                                        target="_blank"
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        {ticket.buyerPhone}
                                                    </a>
                                                </td>
                                                <td className="p-3">
                                                    {ticket.buyerEmail || "-"}
                                                </td>
                                                <td className="p-3">
                                                    {ticket.reservedAt
                                                        ? new Date(
                                                              ticket.reservedAt
                                                                  .seconds *
                                                                  1000
                                                          ).toLocaleString()
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
