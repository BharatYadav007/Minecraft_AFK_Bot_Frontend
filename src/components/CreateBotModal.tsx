'use client'
import { FormEvent, useState } from 'react'
import { createBot } from '../lib/api'

export function CreateBotModal({onCreated}:{onCreated:()=>void}) {
  const [open,setOpen] = useState(false)
  const [error,setError] = useState('')

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const f = new FormData(event.currentTarget)
    try {
      await createBot({
        name:String(f.get('name')).trim(),
        host:String(f.get('host')).trim(),
        port:Number(f.get('port')),
        username:String(f.get('username')).trim(),
        auth:String(f.get('auth')) as 'offline'|'microsoft',
        version:String(f.get('version')??'').trim() || undefined,
        autoConnect:f.get('autoConnect')==='on',
        autoReconnect:f.get('autoReconnect')==='on',
        reconnectDelayMs:10000,
        antiAfk:f.get('antiAfk')==='on',
        antiAfkIntervalMs:30000,
        viewerEnabled:f.get('viewerEnabled')==='on',
        viewerFirstPerson:f.get('viewerFirstPerson')==='on',
        viewerDistance:6,
        autoLoginEnabled:f.get('autoLoginEnabled')==='on',
        autoLoginPassword:String(f.get('autoLoginPassword')??'') || undefined
      })
      setOpen(false); onCreated()
    } catch(error) { setError(error instanceof Error ? error.message : String(error)) }
  }

  if (!open) return <button className="button primary" onClick={()=>setOpen(true)}>+ Add Bot</button>
  return <div className="modal-backdrop"><div className="modal">
    <div className="row between"><h2>Add Bot</h2><button className="button secondary" onClick={()=>setOpen(false)}>Close</button></div>
    <form className="form-grid" onSubmit={submit}>
      <label>Bot name<input name="name" defaultValue="Farm Bot" required/></label>
      <label>Minecraft username<input name="username" defaultValue="AFKBot" required/></label>
      <label>Server host<input name="host" placeholder="play.example.com" required/></label>
      <label>Port<input name="port" type="number" defaultValue="25565" required/></label>
      <label>Authentication<select name="auth" defaultValue="offline"><option value="offline">Offline / cracked</option><option value="microsoft">Microsoft</option></select></label>
      <label>Version<input name="version" placeholder="Auto detect"/></label>
      <label className="check"><input type="checkbox" name="autoConnect"/>Auto connect</label>
      <label className="check"><input type="checkbox" name="autoReconnect" defaultChecked/>Auto reconnect</label>
      <label className="check"><input type="checkbox" name="antiAfk" defaultChecked/>Anti-AFK</label>
      <label className="check"><input type="checkbox" name="viewerEnabled" defaultChecked/>Live viewer</label>
      <label className="check"><input type="checkbox" name="viewerFirstPerson"/>First-person viewer</label>
      <label className="check"><input type="checkbox" name="autoLoginEnabled"/>AuthMe auto-login</label>
      <label>AuthMe password<input name="autoLoginPassword" type="password"/></label>
      {error && <div className="error">{error}</div>}
      <button className="button primary" type="submit">Create Bot</button>
    </form>
  </div></div>
}
