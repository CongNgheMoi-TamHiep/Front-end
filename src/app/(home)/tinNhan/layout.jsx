"use client"
import React, { useState } from 'react'
import './styles.scss'
import { useRouter } from 'next/navigation'
const Layout = ({children}) => {
  const [conversations, setConversations] = useState([
    {id:1}, 
    {id:2},
    {id:3},
  ])
  const router = useRouter(); 
  const [currentConversation, setCurrentConversation] = useState(null);
  const handleRouteToDetailConversation = (item) => { 
    setCurrentConversation(item); 
    router.push(`/tinNhan/${item.id}`)
  }
  return (
    <div className="tinNhan">
        <div className="conversations">
            conversations
            {
              conversations.map((item)=> ( 
                <div 
                  key={item.id} 
                  className={`userConversation ${currentConversation?.id === item.id && "active"}`}
                  onClick={()=>handleRouteToDetailConversation(item)}>
                  {item.id}
                </div>
              ))
            }
        </div>
        {children}
    </div>
  )
}

export default Layout;