import { io } from 'socket.io-client'
import { BACKEND_URL } from './api'
export const socket = io(BACKEND_URL,{autoConnect:false,transports:['websocket','polling']})
