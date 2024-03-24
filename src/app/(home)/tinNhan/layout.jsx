/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import userApis from "@/apis/userApis";
import UserConversationApi from "@/apis/userConversationApi";
import { AuthContext } from "@/context/AuthProvider";
import { SocketContext } from "@/context/SocketProvider";

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUser = React.useContext(AuthContext);
  const [conversations, setConversations] = useState();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [chatReceived, setChatReceived] = useState(null);
  const [watched, setWatched] = useState(false);
  const socket = useContext(SocketContext);
  const cart = { id: 2, t: "a" };
  const handleRouteToDetailConversation = (item) => {
    setCurrentConversation(item);
    console.log(item.conversationId)
    router.push(`/tinNhan/${item.conversationId}`);
  };
  useEffect(() => {
    socket.on("getMessage", (chat) => {
      setChatReceived(chat); 
    })
    setWatched(false);
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      const userConversations = await UserConversationApi.getUserConversationByUserId(
        currentUser?.uid
      );
      console.log(userConversations.conversations); 
      setConversations(userConversations.conversations);
    };


    fetchdata();
  }, []);

  return (
    <div className="tinNhan">
      <div className="conversations">
        Search layout
        {conversations &&
          conversations.map((item) => (
            <div
              key={item.conversationId}
              className={`userConversation ${
                currentConversation?.userId === item?.user?._id && "active"
              }`}
              onClick={() => handleRouteToDetailConversation(item)}
            >
              <div className="avatar">
                <Image
                  className="avatar-img"
                  src={item?.user?.avatar || item?.image || "https://images.pexels.com/photos/6534399/pexels-photo-6534399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                  alt=""
                  width={40}
                  height={40}
                />
              </div>
              <div className="info">
                <div className="name" style={{fontWeight:"bold"}} >{item?.user?.name || item?.name}</div>
                <div className="lastMess">
                  { chatReceived?.conversationId === item?.conversationId
                    ? chatReceived.content.text 
                    :item.lastMess?.content.text}
                </div>
              </div>
            </div>
          ))}
      </div>
      {children}
    </div>
  );
};

export default Layout;
