'use client'
import { useCallback, useEffect, useState } from 'react'
import { listBots } from '../lib/api'
import { socket } from '../lib/socket'
import type { BotSummary } from '../types/bot'
import { BotCard } from '../components/BotCard'
import { CreateBotModal } from '../components/CreateBotModal'

export default function DashboardPage() {
  const [bots,setBots] = useState<BotSummary[]>([])
  const [error,setError] = useState('')
  const refresh = useCallback(async () => { try { setBots(await listBots()); setError('') } catch(error) { setError(error instanceof Error ? error.message : String(error)) } },[])

  useEffect(() => {
    refresh(); socket.connect()
    const handle = (next:BotSummary[]) => setBots(next)
    socket.on('bots:list',handle)
    return () => { socket.off('bots:list',handle); socket.disconnect() }
  },[refresh])

  return <main className="container">
    <section className="hero row between"><div><h1>Minecraft Bots</h1><p className="muted">Manage multiple Mineflayer bots from one dashboard.</p></div><CreateBotModal onCreated={refresh}/></section>
    {error && <div className="error">{error}</div>}
    {bots.length===0 ? <section className="empty"><h2>No bots</h2><p className="muted">Add your first Minecraft bot.</p></section> : <section className="bot-grid">{bots.map(bot=><BotCard key={bot.config.id} bot={bot}/>)}</section>}
  </main>
}
