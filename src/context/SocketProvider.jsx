"use client"
import { useContext, useEffect, useState } from "react";
const { createContext } = require("react")
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "@/components/Loading";
import { AuthContext } from "./AuthProvider";
import { io } from "socket.io-client";

export const SocketContext = createContext(); 
const SocketProvider = ({children}) => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {transports: ['websocket']}); 
    const [socketValue, setSocketValue] = useState(socket);
    const currentUser = useContext(AuthContext);
    useEffect(() => {
        socket.on('connect', () => {
            setSocketValue(socket);
            console.log("socket connected: ",socket.id); 
            if(currentUser?.uid) {
                socket.emit('addUser', currentUser?.uid);
            }
        })
    }, [currentUser?.uid])
    return (
        <SocketContext.Provider value={{socket:socketValue}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);