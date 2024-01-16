"use client"
import React, { useContext, useEffect, useState } from 'react'
import './styles.scss'
import Image from 'next/image';
import ChatIcon from '@mui/icons-material/Chat';
import ChatOutlined from '@mui/icons-material/ChatOutlined';
import ContactsIcon from '@mui/icons-material/Contacts';
import ContactsOutlined from '@mui/icons-material/ContactsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthProvider';
import { auth } from '@/firebase';
const Layout = ({children}) => {
  const [Active, setActive] = useState('tinNhan');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 
  const currentUser = useContext(AuthContext)

  const handleTinNhan = () => { 
    setActive('tinNhan'); 
  }
  const handleDanhBa = () => { 
    setActive('danhBa'); 
  }
  const handleSignOut = () => {
    auth.signOut();
    router.push('/login'); 
  }
  
  useEffect(() => {
    console.log("currenUser: "+currentUser)
    if(currentUser)
      setIsAuthenticated(true)
    else
      setIsAuthenticated(false)
    setIsLoading(false); 
  }, [currentUser])

  if(isLoading) 
    return <Loading/>
  if(!isAuthenticated) 
    return router.push('/login'); 
  else 
    router.push(`/${Active}`);

  return (
    <div className='container'>
      <div className="sidebar">
        <div className="top">
          <Image className="avatar" width={48} height={48} alt="" src="https://images.pexels.com/photos/18111144/pexels-photo-18111144/free-photo-of-equipment-of-a-painter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
          <div  className={`item ${Active==='tinNhan' && 'active'}`} onClick={handleTinNhan}>
            {Active==='tinNhan' ? <ChatIcon sx={{color: '#fff'}}/> : <ChatOutlined sx={{color: '#fff'}}/>}
            <div className="badge">2</div>
          </div>
          <div  className={`item ${Active==='danhBa' && 'active'}`} onClick={handleDanhBa}>
            {Active==='danhBa' ? <ContactsIcon sx={{color: '#fff'}}/> : <ContactsOutlined sx={{color: '#fff'}}/>}
          </div>
        </div>
        <div className="bottom">
          <div className="item" onClick={handleSignOut}>
            <LogoutIcon sx={{color: '#fff', fontSize: 30}}/>
          </div>
        </div>
      </div>
      <div>
        {children}
        </div>    
    </div>
  )
}

export default Layout