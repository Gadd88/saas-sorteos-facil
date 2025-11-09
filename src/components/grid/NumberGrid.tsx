// src/components/NumberGrid.tsx (Versión mejorada con correcciones)
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { raffleService } from "@/services/raffle-services";
import type { Ticket } from "@/types";
import toast from "react-hot-toast";
import { OwnerGridModal } from "@/components";

interface NumberGridProps {
    raffleId: string;
    isOwner: boolean;
    ownerWhatsApp: string;
}

export const NumberGrid = ({
    raffleId,
    isOwner,
    ownerWhatsApp,
}: NumberGridProps) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buyerData, setBuyerData] = useState({
        name: "",
        phone: "",
        email: "",
    });
    const [ownerModal, setOwnerModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        onConfirm?: () => void;
        onCancel?: () => void;
        onLiberate?: () => void;
    }>({ open: false, title: "", message: "" });

    // Escuchar cambios en tiempo real
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, `raffles/${raffleId}/tickets`),
            (snapshot) => {
                const ticketsData = snapshot.docs.map(
                    (doc) => doc.data() as Ticket
                );
                setTickets(ticketsData.sort((a, b) => a.number - b.number));
            },
            (error) => {
                console.error("Error escuchando tickets:", error);
            }
        );

        return unsubscribe;
    }, [raffleId]);

    const closeOwnerModal = () => setOwnerModal({ ...ownerModal, open: false });

    const handleNumberClick = (ticket: Ticket) => {
        if (isOwner) {
            handleOwnerAction(ticket);
        } else {
            if (ticket.status === "disponible") {
                setSelectedNumber(ticket.number);
                setShowModal(true);
            }
        }
    };

    const handleOwnerAction = async (ticket: Ticket) => {
        if (ticket.status === "vendido") {
            setOwnerModal({
                open: true,
                title: "Liberar número",
                message: `Número ${ticket.number} - VENDIDO\n\n¿Deseas LIBERAR este número?`,
                onConfirm: async () => {
                    closeOwnerModal();
                    try {
                        toast.promise(
                            raffleService.releaseTicket(
                                raffleId,
                                ticket.number
                            ),
                            {
                                loading: "Liberando número...",
                                success: "Número liberado",
                                error: "Error al liberar el número",
                            }
                        );
                    } catch (error) {
                        toast.error(
                            "Error al liberar el número" +
                                (error as Error).message
                        );
                    }
                },
            });
        } else if (ticket.status === "reservado") {
            setOwnerModal({
                open: true,
                title: `Número ${ticket.number} - RESERVADO`,
                message: `Comprador: ${ticket.buyerName}\nTeléfono: ${ticket.buyerPhone}\n\nConfirme para marcar como VENDIDO\nLiberar para LIBERAR el número.\nCancele para salir.`,
                onConfirm: async () => {
                    try {
                        toast.promise(
                            raffleService.markAsSold(raffleId, ticket.number),
                            {
                                loading: `Marcando número ${ticket.number} como vendido...`,
                                success: `Número ${ticket.number} marcado como vendido`,
                                error: "Error al actualizar el número",
                            }
                        );
                        closeOwnerModal();
                    } catch (error) {
                        console.error(error);
                        toast.error("Error al actualizar el número");
                    }
                },
                onLiberate: async () => {
                    try {
                        toast.promise(
                            raffleService.releaseTicket(
                                raffleId,
                                ticket.number
                            ),
                            {
                                loading: `Liberando número ${ticket.number}...`,
                                success: `Número ${ticket.number} liberado`,
                                error: "Error al liberar el número",
                            }
                        );
                        closeOwnerModal();
                    } catch (error) {
                        toast.error(
                            "Error al liberar el número" +
                                (error as Error).message
                        );
                    }
                },
                onCancel: () => closeOwnerModal(),
            });
        }
    };

    const handleReservation = async () => {
        if (!selectedNumber || loading) return;

        if (!buyerData.name.trim() || !buyerData.phone.trim()) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }

        setLoading(true);
        try {
            await raffleService.reserveTicket(raffleId, selectedNumber, {
                name: buyerData.name.trim(),
                phone: buyerData.phone.trim(),
                email: buyerData.email.trim(),
            });

            // Generar mensaje de WhatsApp
            const message =
                `¡Hola! Quiero reservar el número *${selectedNumber}*\n\n` +
                `📝 *Mis datos:*\n` +
                `Nombre: ${buyerData.name}\n` +
                `Teléfono: ${buyerData.phone}\n` +
                `Email: ${buyerData.email || "No proporcionado"}`;

            const whatsappUrl = `https://wa.me/${ownerWhatsApp.replace(
                /\D/g,
                ""
            )}?text=${encodeURIComponent(message)}`;

            // Abrir WhatsApp
            window.open(whatsappUrl, "_blank");

            // Cerrar modal
            setShowModal(false);
            setBuyerData({ name: "", phone: "", email: "" });
            setSelectedNumber(null);

            // Mostrar mensaje de éxito
            alert("✅ ¡Número reservado! Ahora coordina el pago por WhatsApp.");
        } catch (error) {
            console.error("Error al reservar:", error);
            alert("Error al reservar el número. Por favor intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const getNumberStyle = (status: Ticket["status"]) => {
        const baseStyle =
            "aspect-square rounded-lg font-bold text-white flex items-center justify-center";

        switch (status) {
            case "disponible":
                return `${baseStyle} bg-green-500 hover:bg-green-600 hover:scale-105 cursor-pointer shadow-md`;
            case "reservado":
                return `${baseStyle} bg-yellow-500 ${
                    isOwner
                        ? "cursor-pointer hover:bg-yellow-600"
                        : "cursor-not-allowed opacity-70"
                }`;
            case "vendido":
                return `${baseStyle} bg-red-500 ${
                    isOwner
                        ? "cursor-pointer hover:bg-red-600"
                        : "cursor-not-allowed opacity-70"
                }`;
            default:
                return baseStyle;
        }
    };

    return (
        <div className="w-full">
            {/* Grilla de números */}
            <div className="grid grid-cols-8 md:grid-cols-10 gap-2 max-w-3xl mx-auto mb-8">
                {tickets.map((ticket) => (
                    <button
                        key={ticket.number}
                        onClick={() => handleNumberClick(ticket)}
                        className={`${getNumberStyle(ticket.status)}`}
                        disabled={!isOwner && ticket.status !== "disponible"}
                        title={
                            ticket.status === "reservado"
                                ? `Reservado por ${ticket.buyerName}`
                                : ticket.status === "vendido"
                                ? `Vendido a ${ticket.buyerName}`
                                : "Disponible"
                        }
                    >
                        {ticket.number < 10
                            ? `0${ticket.number}`
                            : ticket.number}
                    </button>
                ))}
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                    <span className="font-medium">
                        Disponible (
                        {
                            tickets.filter((t) => t.status === "disponible")
                                .length
                        }
                        )
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                    <span className="font-medium">
                        Reservado (
                        {tickets.filter((t) => t.status === "reservado").length}
                        )
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded"></div>
                    <span className="font-medium">
                        Vendido (
                        {tickets.filter((t) => t.status === "vendido").length})
                    </span>
                </div>
            </div>

            {/* Modal de Reserva */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2">
                            Reservar Número {selectedNumber}
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Completa tus datos para reservar este número
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={buyerData.name}
                                    onChange={(e) =>
                                        setBuyerData({
                                            ...buyerData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Teléfono / WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+54 9 11 1234-5678"
                                    value={buyerData.phone}
                                    onChange={(e) =>
                                        setBuyerData({
                                            ...buyerData,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Email (opcional)
                                </label>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={buyerData.email}
                                    onChange={(e) =>
                                        setBuyerData({
                                            ...buyerData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedNumber(null);
                                    setBuyerData({
                                        name: "",
                                        phone: "",
                                        email: "",
                                    });
                                }}
                                className="flex-1 py-3 border-2 rounded-lg hover:bg-gray-50 font-medium"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleReservation}
                                disabled={
                                    loading ||
                                    !buyerData.name.trim() ||
                                    !buyerData.phone.trim()
                                }
                                className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {loading
                                    ? "Reservando..."
                                    : "Reservar y Avisar"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Se abrirá WhatsApp automáticamente con tus datos
                        </p>
                    </div>
                </div>
            )}
            {/* Modal de acciones del propietario */}
            <OwnerGridModal
                isOpen={ownerModal.open}
                title={ownerModal.title}
                message={ownerModal.message}
                onConfirm={ownerModal.onConfirm || (() => {})}
                onCancel={closeOwnerModal}
                onLiberate={ownerModal.onLiberate || (() => {})}
            />
        </div>
    );
};
