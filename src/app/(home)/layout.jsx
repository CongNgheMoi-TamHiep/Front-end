"use client";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import ChatIcon from "@mui/icons-material/Chat";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import ContactsIcon from "@mui/icons-material/Contacts";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import { auth } from "@/firebase";
import axios from "axios";
import axiosPrivate from "@/apis/axios";
import authApis from "@/apis/authApis";
import { SocketContext } from "@/context/SocketProvider";
const Layout = ({ children, params }) => {
  const [Active, setActive] = useState("tinNhan");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentUser = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [conversationId, setConversationId] = useState(params.id);
  const [conversation, setConversation] = useState(null); //[currentUser?.uid, receiverId
  const [currentConversation, setCurrentConversation] = useState(null);
  const [users, setUsers] = useState(null);

  const handleCaNhanUser = (item) => {
    setUsers(item);
    // console.log(item.currentUser?.uid);
    router.push("/caNhanUser");
  };
  const handleTinNhan = () => {
    setActive("tinNhan");
  };
  const handleDanhBa = () => {
    setActive("danhBa");
  };
  const handleSignOut = () => {
    auth.signOut();
    router.push("/login");
    socket.disconnect();
  };

  useEffect(() => {
    if (currentUser) setIsAuthenticated(true);
    else setIsAuthenticated(false);
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => {
    if (!isAuthenticated) return router.push("/login");
    else if (Active) router.push(`/${Active}`);
  }, [Active, isAuthenticated]);

  if (isLoading) return <Loading />;

  return (
    <div className="container">
      <div className="sidebar">
        <div className="top">
          <Image
            className="avatar"
            width={48}
            height={48}
            alt=""
            src="https://images.pexels.com/photos/18111144/pexels-photo-18111144/free-photo-of-equipment-of-a-painter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            onClick={handleCaNhanUser}
          />
          <div
            className={`item ${Active === "tinNhan" && "active"}`}
            onClick={handleTinNhan}
          >
            {Active === "tinNhan" ? (
              <ChatIcon sx={{ color: "#fff" }} />
            ) : (
              <ChatOutlined sx={{ color: "#fff" }} />
            )}
            <div className="badge">2</div>
          </div>
          <div
            className={`item ${Active === "danhBa" && "active"}`}
            onClick={handleDanhBa}
          >
            {Active === "danhBa" ? (
              <ContactsIcon sx={{ color: "#fff" }} />
            ) : (
              <ContactsOutlined sx={{ color: "#fff" }} />
            )}
          </div>
        </div>
        <div className="bottom">
          <div className="item" onClick={handleSignOut}>
            <LogoutIcon sx={{ color: "#fff", fontSize: 30 }} />
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
