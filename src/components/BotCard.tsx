import type { BotSummary } from '../types/bot'
import { StatusBadge } from './StatusBadge'

export function BotCard({bot}:{bot:BotSummary}) {
  return <a className="bot-card" href={`/bots/${bot.config.id}`}>
    <div className="row between"><div><h3>{bot.config.name}</h3><div className="muted">{bot.config.username}</div></div><StatusBadge runtime={bot.runtime}/></div>
    <div className="server-address">{bot.config.host}:{bot.config.port}</div>
    <div className="stats compact">
      <div><span>Auth</span><strong>{bot.config.auth}</strong></div>
      <div><span>Health</span><strong>{bot.runtime.health ?? '—'}</strong></div>
      <div><span>Players</span><strong>{bot.runtime.players ?? '—'}</strong></div>
    </div>
  </a>
}
