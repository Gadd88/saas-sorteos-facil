// src/pages/PublicRaffle.tsx
import { NumberGrid } from '@/components';
import { raffleService } from '@/services/raffle-services';
import type { Raffle } from '@/types';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const PublicRaffleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRaffle();
  }, [slug]);

  const loadRaffle = async () => {
    if (!slug) return;

    try {
      const data = await raffleService.getRaffle(slug);
      
      if (!data) {
        alert('Sorteo no encontrado');
        return;
      }

      if (!data.isActive) {
        alert('Este sorteo ya no está activo');
      }

      setRaffle(data);
    } catch (error) {
      console.error('Error cargando sorteo:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!raffle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">😕</h1>
          <h2 className="text-2xl font-bold mb-2">Sorteo no encontrado</h2>
          <p className="text-gray-600">El sorteo que buscas no existe o fue eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {raffle.title}
            </h1>
            {raffle.description && (
              <p className="text-xl text-gray-600 mb-6">{raffle.description}</p>
            )}
            
            {/* Premio */}
            <div className="bg-linear-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="text-sm uppercase tracking-wide text-yellow-800 font-semibold mb-2">
                🏆 Premio
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {raffle.prizeDescription}
              </div>
            </div>

            {/* Precio */}
            <div className="mt-6 inline-block bg-green-100 px-8 py-3 rounded-full">
              <span className="text-sm text-green-800 font-semibold">
                Precio por número:
              </span>
              <span className="text-3xl font-bold text-green-900 ml-2">
                ${raffle.ticketPrice}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-3 text-lg">📌 Cómo participar:</h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Elige tu número favorito de la grilla (los verdes están disponibles)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Completa tus datos en el formulario</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Se abrirá WhatsApp automáticamente para coordinar el pago</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>¡Listo! Tu número quedará reservado</span>
            </li>
          </ol>
        </div>

        {/* Grilla */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <NumberGrid 
            raffleId={raffle.id}
            isOwner={false}
            ownerWhatsApp={raffle.ownerWhatsApp}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Organizado por: <strong>{raffle.ownerName}</strong>
          </p>
          <p className="text-xs mt-2">
            ¿Quieres crear tu propio sorteo? 
            <a href="/" className="text-blue-600 hover:underline ml-1">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}