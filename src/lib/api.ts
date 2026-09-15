import type { BotConfig, BotSummary } from '../types/bot'

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000'
export type BotCreateInput = Omit<BotConfig,'id'|'createdAt'|'updatedAt'>

export async function api<T>(path:string, options:RequestInit = {}): Promise<T> {
  const response = await fetch(`${BACKEND_URL}/api${path}`, {
    ...options,
    headers: {'Content-Type':'application/json', ...(options.headers ?? {})}
  })
  if (response.status === 204) return undefined as T
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`)
  return data as T
}

export const listBots = () => api<BotSummary[]>('/bots')
export const getBot = (id:string) => api<BotSummary>(`/bots/${id}`)
export const createBot = (input:BotCreateInput) => api<BotSummary>('/bots',{method:'POST',body:JSON.stringify(input)})
export const deleteBot = (id:string) => api<void>(`/bots/${id}`,{method:'DELETE'})
export const botAction = (id:string, action:string, body?:unknown) => api<{ok:true}>(`/bots/${id}/${action}`,{method:'POST',body:body===undefined?undefined:JSON.stringify(body)})
