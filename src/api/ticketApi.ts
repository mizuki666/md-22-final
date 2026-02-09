import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Ticket, SortField } from '../types/ticket'
import { mockTickets } from '../data/mockData'

// Локальный мок без MSW
export const fetchTickets = createAsyncThunk<
  Ticket[],
  { 
    companies?: string[]
    stops?: number[]
    sortBy?: SortField
    order?: 'asc' | 'desc'
  } | undefined
>('tickets/fetchTickets', async (params = {}, { rejectWithValue }) => {
  try {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let tickets = [...mockTickets]
    
    // Фильтрация по компаниям
    if (params.companies?.length) {
      tickets = tickets.filter(ticket => 
        params.companies!.includes(ticket.company)
      )
    }
    
    // Фильтрация по пересадкам
    if (params.stops?.length) {
      tickets = tickets.filter(ticket => {
        const stops = ticket.connectionAmount === null ? 0 : ticket.connectionAmount
        return params.stops!.includes(stops)
      })
    }
    
    // Сортировка
    if (params.sortBy) {
      tickets.sort((a, b) => {
        const aValue = a[params.sortBy!] as number || 0
        const bValue = b[params.sortBy!] as number || 0
        
        if (params.order === 'desc') {
          return bValue - aValue
        }
        return aValue - bValue
      })
    }
    
    return tickets
  } catch (error) {
    return rejectWithValue('Ошибка загрузки билетов')
  }
})

// Получение списка компаний
export const fetchCompanies = createAsyncThunk<string[], void>(
  'tickets/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const companies = [...new Set(mockTickets.map(t => t.company))]
      return companies
    } catch (error) {
      return rejectWithValue('Ошибка загрузки компаний')
    }
  }
)