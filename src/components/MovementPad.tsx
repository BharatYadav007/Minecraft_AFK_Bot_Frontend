'use client'
import { botAction } from '../lib/api'
const controls = [['forward','W'],['left','A'],['back','S'],['right','D'],['jump','Jump'],['sprint','Sprint'],['sneak','Sneak']] as const

export function MovementPad({botId,disabled}:{botId:string;disabled:boolean}) {
  const set = (control:string,state:boolean) => botAction(botId,'control',{control,state})
  return <div className="movement-grid">
    {controls.map(([name,label]) => <button key={name} disabled={disabled} className="button secondary" onMouseDown={()=>set(name,true)} onMouseUp={()=>set(name,false)} onMouseLeave={()=>set(name,false)}>{label}</button>)}
    <button disabled={disabled} className="button danger" onClick={()=>botAction(botId,'stop-movement')}>Stop</button>
  </div>
}
