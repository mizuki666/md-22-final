import type { Ticket } from '../types/ticket';

export async function fetchTickets(): Promise<Ticket[]> {
    const res = await fetch('/tickets.json');
    if (!res.ok) {
    throw new Error('Failed to fetch tickets');
    }
    const data = await res.json();
    return data as Ticket[];
}