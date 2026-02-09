import type { Ticket } from '../types/ticket';

export const mockTickets: Ticket[] = [
    {
        id: 1,
        from: 'Москва',
        to: 'Санкт-Петербург',
        company: 'S7 Airlines',
        price: 12500,
        currency: 'RUB',
        time: { startTime: '08:00', endTime: '10:30' },
        duration: 150,
        date: '2024-03-15',
        connectionAmount: null
    },
    {
        id: 2,
        from: 'Москва',
        to: 'Сочи',
        company: 'Red Wings',
        price: 18900,
        currency: 'RUB',
        time: { startTime: '14:20', endTime: '17:00' },
        duration: 160,
        date: '2024-03-16',
        connectionAmount: 1
    },
    {
        id: 3,
        from: 'Санкт-Петербург',
        to: 'Казань',
        company: 'Победа',
        price: 8500,
        currency: 'RUB',
        time: { startTime: '11:45', endTime: '14:15' },
        duration: 150,
        date: '2024-03-17',
        connectionAmount: null
    },
    {
        id: 4,
        from: 'Москва',
        to: 'Екатеринбург',
        company: 'Nordwind Airlines',
        price: 14500,
        currency: 'RUB',
        time: { startTime: '20:10', endTime: '23:40' },
        duration: 210,
        date: '2024-03-18',
        connectionAmount: 2
    },
    {
        id: 5,
        from: 'Сочи',
        to: 'Москва',
        company: 'S7 Airlines',
        price: 13200,
        currency: 'RUB',
        time: { startTime: '09:30', endTime: '12:00' },
        duration: 150,
        date: '2024-03-19',
        connectionAmount: null
    },
    {
        id: 6,
        from: 'Казань',
        to: 'Санкт-Петербург',
        company: 'Red Wings',
        price: 11500,
        currency: 'RUB',
        time: { startTime: '16:45', endTime: '19:15' },
        duration: 150,
        date: '2024-03-20',
        connectionAmount: 1
    },
    {
        id: 7,
        from: 'Екатеринбург',
        to: 'Сочи',
        company: 'Победа',
        price: 9500,
        currency: 'RUB',
        time: { startTime: '13:20', endTime: '17:50' },
        duration: 270,
        date: '2024-03-21',
        connectionAmount: 1
    },
    {
        id: 8,
        from: 'Новосибирск',
        to: 'Москва',
        company: 'Nordwind Airlines',
        price: 21000,
        currency: 'RUB',
        time: { startTime: '06:00', endTime: '10:30' },
        duration: 270,
        date: '2024-03-22',
        connectionAmount: null
    },
    {
        id: 9,
        from: 'Москва',
        to: 'Калининград',
        company: 'S7 Airlines',
        price: 11000,
        currency: 'RUB',
        time: { startTime: '12:15', endTime: '14:00' },
        duration: 105,
        date: '2024-03-23',
        connectionAmount: null
    },
    {
        id: 10,
        from: 'Санкт-Петербург',
        to: 'Екатеринбург',
        company: 'Red Wings',
        price: 16800,
        currency: 'RUB',
        time: { startTime: '18:30', endTime: '22:45' },
        duration: 255,
        date: '2024-03-24',
        connectionAmount: 1
    }
];

export const mockCompanies = ['S7 Airlines', 'Red Wings', 'Победа', 'Nordwind Airlines'];