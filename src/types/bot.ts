export type BotAuthMode = 'offline' | 'microsoft'

export interface BotConfig {
  id: string
  name: string
  host: string
  port: number
  username: string
  auth: BotAuthMode
  version?: string
  autoConnect: boolean
  autoReconnect: boolean
  reconnectDelayMs: number
  antiAfk: boolean
  antiAfkIntervalMs: number
  viewerEnabled: boolean
  viewerFirstPerson: boolean
  viewerDistance: number
  autoLoginEnabled: boolean
  autoLoginPassword?: string
  createdAt: string
  updatedAt: string
}

export interface BotRuntime {
  connected: boolean
  connecting: boolean
  spawned: boolean
  reconnecting: boolean
  health?: number
  food?: number
  position?: { x:number; y:number; z:number }
  yaw?: number
  pitch?: number
  gameMode?: string
  dimension?: string
  players?: number
  viewerPort?: number
  viewerUrl?: string | null
  lastError?: string | null
  lastConnectedAt?: string | null
  lastDisconnectedAt?: string | null
}

export interface BotSummary { config: BotConfig; runtime: BotRuntime }
export interface BotEvent { botId:string; timestamp:number; message:string; level?:'info'|'warn'|'error' }
