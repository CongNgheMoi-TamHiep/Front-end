/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
const Layout = ({ children }) => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      image:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
      hisMess: "abc gần rồi...",
    },
    {
      id: 2,
      image:
        "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_4_resize.jpg",
      name: "Huỳnh Khương Anh",
      hisMess: "hay lắm con trai",
    },
    {
      id: 3,
      image:
        "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_6_resize.jpg",
      name: "Bá Zô Mà Núc",
      hisMess: "vcl lun đừng làm thế mà :33 vcl lun...đừng làm thế mà :33",
    },
  ]);
  const router = useRouter();
  const [currentConversation, setCurrentConversation] = useState(null);
  const handleRouteToDetailConversation = (item) => {
    setCurrentConversation(item);
    router.push(`/tinNhan/${item.id}`);
  };
  console.log(currentConversation);
  return (
    <div className="tinNhan">
      <div className="conversations">
        Search layout
        {conversations.map((item) => (
          <div
            key={item.id}
            className={`userConversation ${
              currentConversation?.id === item.id && "active"
            }`}
            onClick={() => handleRouteToDetailConversation(item)}
          >
            <div className="avatar">
              <img
                className="avatar-img"
                src={item.image}
                alt=""
                width={40}
                height={40}
              />
            </div>
            <div className="info">
              <div className="name">{item.name}</div>
              <div className="lastMess">
                {item.hisMess.split(" ").length > 6
                  ? `${item.hisMess.split(" ").slice(0, 4).join(" ")}...`
                  : item.hisMess}
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
