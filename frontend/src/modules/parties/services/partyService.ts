import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../shared/db';

export interface PartyDTO {
  id: string;
  name: string;
  type: 'customer' | 'supplier' | 'both';
  createdAt: string;
}

export interface IPartyService {
  getParties(): Promise<PartyDTO[]>;
  createParty(data: Omit<PartyDTO, 'id' | 'createdAt'>): Promise<PartyDTO>;
  seedFixtures(parties: PartyDTO[]): Promise<void>;
}

export class LocalPartyService implements IPartyService {
  async getParties(): Promise<PartyDTO[]> {
    return db.parties.toArray();
  }

  async createParty(data: Omit<PartyDTO, 'id' | 'createdAt'>): Promise<PartyDTO> {
    const party: PartyDTO = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    await db.parties.add(party);
    return party;
  }

  async seedFixtures(parties: PartyDTO[]): Promise<void> {
     await db.parties.bulkPut(parties);
  }
}

export const partyService = new LocalPartyService();
