import type { BotRuntime } from '../types/bot'

export function StatusBadge({runtime}:{runtime:BotRuntime}) {
  const online = runtime.spawned
  const pending = runtime.connecting || runtime.reconnecting
  return <span className={`status ${online?'online':pending?'pending':'offline'}`}>
    {online?'Online':runtime.reconnecting?'Reconnecting':runtime.connecting?'Connecting':'Offline'}
  </span>
}
