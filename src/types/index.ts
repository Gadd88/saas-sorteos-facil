import { Timestamp } from 'firebase/firestore';
// src/types/index.ts
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp | null;
}

export interface Raffle {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerWhatsApp: string; // Para recibir notificaciones
  title: string;
  description: string;
  prizeDescription: string;
  ticketPrice: number;
  createdAt: Timestamp | null;
  isActive: boolean;
  slug: string; // URL amigable: /s/mi-sorteo-navidad
}

export interface Ticket {
  number: number;
  status: 'disponible' | 'reservado' | 'vendido';
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  reservedAt?: Timestamp | null;
  soldAt?: Timestamp | null;
}

// export interface Ticket2 {
//   id: string;
//   raffleId: string;
//   number: number; // Cambiado: ahora soporta 0-999
//   status: 'disponible' | 'reservado' | 'vendido';
//   buyerName?: string;
//   buyerPhone?: string;
//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// Estructura en Firestore:
// raffles/{raffleId}
// raffles/{raffleId}/tickets/{ticketNumber}