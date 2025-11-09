// Modal.tsx
type ModalProps = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    liberateText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    onLiberate?: () => void;
};

export const OwnerGridModal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    liberateText = "Liberar",
    onConfirm,
    onCancel,
    onLiberate,
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-sm">
                <h2 className="text-lg font-semibold mb-3">{title}</h2>
                <p className="text-gray-600 mb-6 whitespace-pre-line">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    {title.includes("RESERVADO") && (
                        <button
                            onClick={onLiberate}
                            className="px-4 py-2 bg-yellow-400 font-semibold rounded-lg hover:bg-yellow-300 cursor-pointer"
                        >
                            {liberateText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold cursor-pointer"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
