// src/pages/CreateRaffle.tsx
import { useAuth } from '@/hooks/useAuth';
import { raffleService } from '@/services/raffle-services';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const CreateRaffleView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prizeDescription: '',
    ticketPrice: '',
    ownerWhatsApp: '',
    slug: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const raffleId = await raffleService.createRaffle({
        ownerId: user.uid,
        ownerName: user.displayName || user.email || '',
        ownerWhatsApp: `+54${formData.ownerWhatsApp.replace(/\D/g, '')}`, // Solo números
        title: formData.title,
        description: formData.description,
        prizeDescription: formData.prizeDescription,
        ticketPrice: parseFloat(formData.ticketPrice),
        slug: formData.slug || generateSlug(formData.title),
        isActive: true
      });
      navigate(`/dashboard/raffle/${raffleId}`);
    } catch (error) {
      console.error('Error creando sorteo:', error);
      toast.error('Error al crear el sorteo.' + (error as Error).message);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value)
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Crear Nuevo Sorteo</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Título del Sorteo *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ej: Sorteo Navideño 2024"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* URL Personalizada */}
            <div>
              <label className="block text-sm font-medium mb-2">
                URL del Sorteo
              </label>
              <div className="flex flex-col lg:flex-row items-start lg:items-center">
                <span className="text-gray-500 mr-2">saas-sorteos-facil.vercel.app/s/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")})}
                  placeholder="sorteo-navidad"
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  pattern="[a-z0-9\-]+"
                  title="Solo letras minúsculas, números y guiones"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Solo letras minúsculas, números y guiones (-)
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe tu sorteo..."
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Premio */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción del Premio *
              </label>
              <textarea
                value={formData.prizeDescription}
                onChange={(e) => setFormData({...formData, prizeDescription: e.target.value})}
                placeholder="Ej: iPhone 15 Pro Max 256GB + AirPods Pro"
                rows={2}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Precio por Número *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                  placeholder="500"
                  step="0.01"
                  min="0"
                  className="w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tu WhatsApp (para recibir notificaciones) *
              </label>
              <input
                type="tel"
                value={formData.ownerWhatsApp}
                onChange={(e) => setFormData({...formData, ownerWhatsApp: e.target.value})}
                placeholder="1112345678"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Sin espacios ni guiones, ni 0 ni 15. Ej: 1198765432
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Sorteo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}