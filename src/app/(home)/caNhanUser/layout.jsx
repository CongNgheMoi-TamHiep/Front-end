"use client";
import React, { useContext, useEffect, useState } from "react";
// import "./styles.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import userApis from "@/apis/userApis";
import UserConversationApi from "@/apis/userConversationApi";
import { AuthContext } from "@/context/AuthProvider";
import { SocketContext } from "@/context/SocketProvider";
import SearchIcon from "@mui/icons-material/Search";

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUser = React.useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [chatReceived, setChatReceived] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = useContext(SocketContext);

  const handleRouteToDetailConversation = (item) => {
    setCurrentConversation(item);
    console.log(item.conversationId);
    router.push(`/tinNhan/${item.conversationId}`);
  };

  useEffect(() => {
    socket.on("getMessage", (chat) => {
      setChatReceived(chat);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userConversations =
        await UserConversationApi.getUserConversationByUserId(currentUser?.uid);
      console.log(userConversations.conversations);
      setConversations(userConversations.conversations);

      if (userConversations.conversations.length > 0) {
        setCurrentConversation(userConversations.conversations[0]);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredConversations = conversations.filter((item) => {
    const searchValue = searchTerm.toLowerCase();
    if (item) {
      const userName = item.user?.name || "";
      const groupName = item.name || "";
      return (
        userName.toLowerCase().includes(searchValue) ||
        groupName.toLowerCase().includes(searchValue)
      );
    }
    return false;
  });

  const formatTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const differenceInSeconds = Math.floor((currentTime - createdAt) / 1000);
    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} giây`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} phút`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} giờ`;
    } else {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} ngày`;
    }
  };

  return (
    <div className="tinNhan">
      <div className="conversations">
        <div className="search-div">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <SearchIcon className="icon icon-search" />
        </div>

        {filteredConversations.map((item) => (
          <div
            key={item.conversationId}
            className={`userConversation ${
              currentConversation &&
              currentConversation.conversationId === item.conversationId
                ? "active"
                : ""
            }`}
            onClick={() => handleRouteToDetailConversation(item)}
          >
            <div className="avatar">
              <Image
                className="avatar-img"
                src={
                  item?.user?.avatar ||
                  item?.image ||
                  "https://images.pexels.com/photos/6534399/pexels-photo-6534399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                }
                alt=""
                width={60}
                height={60}
              />
            </div>
            <div className="info" style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="name"
                  style={{ fontWeight: "bold", fontSize: "16px" }}
                >
                  {item?.user?.name || item?.name}
                </div>
                <div>
                  {item.lastMess && (
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "normal",
                      }}
                    >
                      {formatTimeDifference(new Date(item.lastMess.createdAt))}
                    </span>
                  )}
                </div>
              </div>
              <div className="lastMess">
                {chatReceived?.conversationId === item?.conversationId
                  ? chatReceived.senderId === currentUser.uid
                    ? "Bạn: " + chatReceived.content.text
                    : item.user.name + ": " + chatReceived.content.text
                  : item.lastMess?.senderId === currentUser.uid
                  ? "Bạn: " + item.lastMess?.content.text
                  : item.user.name + ": " + item.lastMess?.content.text}
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
