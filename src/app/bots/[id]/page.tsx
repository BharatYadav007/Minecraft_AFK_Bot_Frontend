'use client'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { botAction, deleteBot, getBot } from '../../../lib/api'
import { socket } from '../../../lib/socket'
import type { BotEvent, BotRuntime, BotSummary } from '../../../types/bot'
import { StatusBadge } from '../../../components/StatusBadge'
import { MovementPad } from '../../../components/MovementPad'
import { BotConsole } from '../../../components/BotConsole'

export default function BotPage() {
  const {id} = useParams<{id:string}>(); const router=useRouter()
  const [bot,setBot] = useState<BotSummary|null>(null)
  const [events,setEvents] = useState<BotEvent[]>([])
  const [error,setError] = useState('')
  const [target,setTarget] = useState({x:'',y:'',z:''})
  const refresh = useCallback(async()=>{try{setBot(await getBot(id));setError('')}catch(error){setError(error instanceof Error?error.message:String(error))}},[id])

  useEffect(()=>{
    refresh(); socket.connect(); socket.emit('bot:subscribe',id)
    const telemetry=(runtime:BotRuntime)=>setBot(current=>current?{...current,runtime}:current)
    const append=(event:BotEvent)=>setEvents(current=>[event,...current].slice(0,200))
    socket.on('bot:telemetry',telemetry); socket.on('bot:log',append); socket.on('bot:chat',append)
    return()=>{socket.emit('bot:unsubscribe',id);socket.off('bot:telemetry',telemetry);socket.off('bot:log',append);socket.off('bot:chat',append);socket.disconnect()}
  },[id,refresh])

  async function action(name:string,body?:unknown){try{setError('');await botAction(id,name,body);await refresh()}catch(error){setError(error instanceof Error?error.message:String(error))}}
  async function goTo(e:FormEvent){e.preventDefault();await action('goto',{x:Number(target.x),y:Number(target.y),z:Number(target.z),radius:1})}
  async function remove(){if(!window.confirm('Delete this bot?'))return;try{await deleteBot(id);router.push('/')}catch(error){setError(error instanceof Error?error.message:String(error))}}

  if(!bot)return <main className="container">{error||'Loading...'}</main>
  const {config,runtime}=bot

  return <main className="container">
    <section className="page-heading row between"><div><a href="/" className="back">← All bots</a><h1>{config.name}</h1><p className="muted">{config.username} · {config.host}:{config.port}</p></div><StatusBadge runtime={runtime}/></section>
    {error&&<div className="error">{error}</div>}
    <section className="toolbar">
      <button className="button primary" disabled={runtime.connected||runtime.connecting} onClick={()=>action('connect')}>Connect</button>
      <button className="button secondary" disabled={!runtime.connected&&!runtime.connecting&&!runtime.reconnecting} onClick={()=>action('disconnect')}>Disconnect</button>
      <button className="button secondary" onClick={()=>action('reconnect')}>Reconnect</button>
      <button className="button secondary" onClick={()=>action('anti-afk',{enabled:!config.antiAfk})}>Anti-AFK: {config.antiAfk?'On':'Off'}</button>
      <button className="button danger" onClick={remove}>Delete Bot</button>
    </section>

    <section className="stats">
      <div><span>Health</span><strong>{runtime.health??'—'}</strong></div>
      <div><span>Food</span><strong>{runtime.food??'—'}</strong></div>
      <div><span>Players</span><strong>{runtime.players??'—'}</strong></div>
      <div><span>Position</span><strong>{runtime.position?`${runtime.position.x}, ${runtime.position.y}, ${runtime.position.z}`:'—'}</strong></div>
    </section>

    <div className="two-column">
      <section className="panel"><div className="row between"><h2>Live View</h2>{runtime.viewerUrl&&<a href={runtime.viewerUrl} className="small-link" target="_blank" rel="noreferrer">Open ↗</a>}</div>{runtime.spawned&&runtime.viewerUrl?<iframe className="viewer" src={runtime.viewerUrl} title="Minecraft bot viewer"/>:<div className="viewer-placeholder">Viewer appears after the bot spawns.</div>}</section>
      <section className="panel"><h2>Movement</h2><MovementPad botId={id} disabled={!runtime.spawned}/><h3>Go to coordinates</h3><form className="goto" onSubmit={goTo}>{(['x','y','z'] as const).map(axis=><input key={axis} type="number" placeholder={axis.toUpperCase()} value={target[axis]} onChange={e=>setTarget({...target,[axis]:e.target.value})} required/>)}<button className="button primary" disabled={!runtime.spawned}>Go</button></form></section>
    </div>
    <BotConsole botId={id} events={events} disabled={!runtime.spawned}/>
  </main>
}
