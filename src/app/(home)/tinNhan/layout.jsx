/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import userApis from "@/apis/userApis";
import UserConversationApi from "@/apis/userConversationApi";
import { AuthContext } from "@/context/AuthProvider";

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUser = React.useContext(AuthContext);
  const [conversations, setConversations] = useState();
  const [currentConversation, setCurrentConversation] = useState(null);

  const cart = { id: 2, t: "a" };
  const handleRouteToDetailConversation = (item) => {
    setCurrentConversation(item);
    router.push(`/tinNhan/${item.conversationId}`);
  };

  useEffect(() => {
    const fetchdata = async () => {
      const userConversations =
        await UserConversationApi.getUserConversationByUserId(currentUser.uid);
      // const users = await userApis.getAllUsers();
      // const users = [];
      setConversations(userConversations.conversations);
      // console.log(currentUser, userConversations.data.conversations[0]);
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
              key={item.userId}
              className={`userConversation ${
                currentConversation?.userId === item.userId && "active"
              }`}
              onClick={() => handleRouteToDetailConversation(item)}
            >
              <div className="avatar">
                <img
                  className="avatar-img"
                  src={item.avatar}
                  alt=""
                  width={40}
                  height={40}
                />
              </div>
              <div className="info">
                <div className="name">{item.userName}</div>
                <div className="lastMess">
                  {/* {(item.hisMess).split(" ").length > 6
                  ? `${item.hisMess.split(" ").slice(0, 4).join(" ")}...`
                  : item.hisMess} */}
                  {item.lastMess?.content.text}
                  {/* abc */}
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
