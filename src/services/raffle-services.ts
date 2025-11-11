// src/services/raffleService.ts
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc,
  getDocs,
  query,
  where,
  writeBatch, 
  serverTimestamp,
  runTransaction,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Raffle, Ticket } from '../types';

const slugExists = async (slug: string): Promise<boolean> => {
  const q = query(
    collection(db, 'raffles'), where(slug, "==", slug)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  return `${baseSlug}-${Date.now()}`
}


export const raffleService = {
  // Crear nuevo sorteo con 100 números
  async createRaffle(raffleData: Omit<Raffle, 'id' | 'createdAt'>) {

    //Validacion de numero de sorteos creados
    const q = query(collection(db, 'raffles'), where('ownerId', '==', raffleData.ownerId));
    const snapshot = await getCountFromServer(q)
    if(snapshot.data().count >= 3){
      throw new Error('Límite de sorteos alcanzado. El usuario no puede crear más de 5 sorteos.');
    }
    try {
      if(await slugExists(raffleData.slug)) throw new Error('El slug ya existe, por favor elija otro diferente.')
      
      const raffleRef = await addDoc(collection(db, 'raffles'), {
        ...raffleData,
        createdAt: serverTimestamp(),
        slug: await generateUniqueSlug(raffleData.slug),
        isActive: true
      });
  
      // Crear los 100 tickets
      const batch = writeBatch(db);
      // let createdCount = 0
      for (let i = 1; i <= 100; i++) {
        const ticketRef = doc(db, `raffles/${raffleRef.id}/tickets`, i.toString());
        batch.set(ticketRef, {
          number: i,
          status: 'disponible'
        });
        // createdCount++;
      }
      await batch.commit();
      // const ticketSnapshot = await getDocs(
      //   collection(db, `raffles/${raffleRef.id}/tickets`)
      // );
  
      return raffleRef.id;
    } catch (error) {
      throw new Error('Error creando sorteo: ' + (error as Error).message);
    }
  },

  // Obtener sorteos del usuario
  async getUserRaffles(userId: string) {
    const q = query(
      collection(db, 'raffles'),
      where('ownerId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Raffle));
  },

  // Obtener un sorteo por ID o slug
  async getRaffle(identifier: string) {
    // Intentar por ID primero
    const raffleDoc = await getDoc(doc(db, 'raffles', identifier));
    
    if (raffleDoc.exists()) {
      return { id: raffleDoc.id, ...raffleDoc.data() } as Raffle;
    }

    // Si no existe, buscar por slug
    const q = query(
      collection(db, 'raffles'),
      where('slug', '==', identifier)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Raffle;
    }

    return null;
  },

  // Obtener tickets de un sorteo
  async getTickets(raffleId: string): Promise<Ticket[]> {
    const ticketsSnapshot = await getDocs(
      collection(db, `raffles/${raffleId}/tickets`)
    );
    return ticketsSnapshot.docs.map(doc => doc.data() as Ticket);
  },

  // Reservar un número (comprador)
  async reserveTicket(
    raffleId: string, 
    ticketNumber: number, 
    buyerData: { name: string; phone: string; email?: string }
  ) {
    const ticketRef = doc(db, `raffles/${raffleId}/tickets`, ticketNumber.toString());
    try {
      await runTransaction(db, async (transaction) => {
        const ticketSnap = await transaction.get(ticketRef);
        if (!ticketSnap.exists()) {
          throw new Error('Número no encontrado');
        }
        const ticket = ticketSnap.data() as Ticket;
        if (ticket.status !== 'disponible') {
          throw new Error('Número ya reservado o vendido');
        }

        transaction.update(ticketRef, {
          status: 'reservado',
          buyerName: buyerData.name,
          buyerPhone: buyerData.phone,
          buyerEmail: buyerData.email || '',
          reservedAt: serverTimestamp()
        })
      })
      return { ok: true }
    } catch (error){
      return { ok: false, error: (error as Error).message}
    }
    // await updateDoc(ticketRef, {
    //   status: 'reservado',
    //   buyerName: buyerData.name,
    //   buyerPhone: buyerData.phone,
    //   buyerEmail: buyerData.email || '',
    //   reservedAt: serverTimestamp()
    // });
  },

  // Marcar como vendido (owner)
  async markAsSold(raffleId: string, ticketNumber: number) {
    const ticketRef = doc(db, `raffles/${raffleId}/tickets`, ticketNumber.toString());
    
    await updateDoc(ticketRef, {
      status: 'vendido',
      soldAt: serverTimestamp()
    });
  },

  // Liberar número reservado (owner)
  async releaseTicket(raffleId: string, ticketNumber: number) {
    const ticketRef = doc(db, `raffles/${raffleId}/tickets`, ticketNumber.toString());
    
    await updateDoc(ticketRef, {
      status: 'disponible',
      buyerName: null,
      buyerPhone: null,
      buyerEmail: null,
      reservedAt: null
    });
  },

  async toggleRaffleStatus(raffleId: string, isActive: boolean) {
    const raffleRef = doc(db, 'raffles', raffleId);
    await updateDoc(raffleRef, {
      isActive: !isActive
    });
  },

  async deleteRaffle(raffleId: string) {
    // Primero eliminar todos los tickets
    const ticketsSnapshot = await getDocs(
      collection(db, `raffles/${raffleId}/tickets`)
    );
    
    const batch = writeBatch(db);
    
    ticketsSnapshot.docs.forEach(ticketDoc => {
      batch.delete(ticketDoc.ref);
    });
    
    // Eliminar el sorteo
    const raffleRef = doc(db, 'raffles', raffleId);
    batch.delete(raffleRef);
    
    await batch.commit();
  },

  async updateRaffle(raffleId: string, data: Partial<Raffle>) {
    const raffleRef = doc(db, 'raffles', raffleId);
    await updateDoc(raffleRef, data);
  }
};

