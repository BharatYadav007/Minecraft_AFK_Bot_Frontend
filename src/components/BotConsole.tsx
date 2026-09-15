'use client'
import { FormEvent, useState } from 'react'
import type { BotEvent } from '../types/bot'
import { botAction } from '../lib/api'

export function BotConsole({botId,events,disabled}:{botId:string;events:BotEvent[];disabled:boolean}) {
  const [message,setMessage] = useState('')
  async function submit(e:FormEvent) { e.preventDefault(); const value=message.trim(); if(!value)return; await botAction(botId,'chat',{message:value}); setMessage('') }
  return <section className="panel"><h2>Console</h2>
    <div className="console">{events.slice().sort((a,b)=>b.timestamp-a.timestamp).slice(0,120).map((e,i)=><div key={`${e.timestamp}-${i}`} className={`console-line ${e.level??'chat'}`}><span className="time">{new Date(e.timestamp).toLocaleTimeString()}</span>{e.message}</div>)}</div>
    <form className="console-input" onSubmit={submit}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Chat or /command" disabled={disabled}/><button className="button primary" disabled={disabled}>Send</button></form>
  </section>
}
