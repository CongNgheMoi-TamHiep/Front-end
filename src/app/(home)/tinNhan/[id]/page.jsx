/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, {useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Button, IconButton, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import WidthNormalIcon from "@mui/icons-material/WidthNormal";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import ContactEmergencyOutlinedIcon from "@mui/icons-material/ContactEmergencyOutlined";
import KitesurfingIcon from "@mui/icons-material/Kitesurfing";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Divider from "@mui/material/Divider";
import { AuthContext } from "@/context/AuthProvider";
import ConversationApi from "@/apis/ConversationApi";
import ChatApi from "@/apis/ChatApi";
import EmojiPicker from "emoji-picker-react";
import { SocketContext } from "@/context/SocketProvider";
import Image from "next/image";
import userApis from "@/apis/userApis";
import CombineUserId from "@/utils/CombineUserId";
import axiosPrivate from "@/apis/axios";

const lastTime = "Truy cập 1 phút trước";

const page = ({ params }) => {
  const receiverId = params.id;
  const currentUser = useContext(AuthContext);
  const endRef = useRef();
  const inputPhotoRef = useRef();
  const containerRef = useRef();
  const socket = useContext(SocketContext);
  const [conversationId, setConversationId] = useState(params.id);
  const [conversation, setConversation] = useState(null);//[currentUser?.uid, receiverId
  const [text, setText] = useState("");
  const [userNhan, setUserNhan] = useState({});
  const [chats, setChat] = useState([]);
  const [chatReceived, setChatReceived] = useState(null);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [me, setMe] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      //fetch user
      const conversationResponse = await ConversationApi.getConversationById(conversationId); 
      let userNhan1 = null; 
      let conversationId1 = null; 
      let me1=null
      if( conversationResponse?._id  ) {
        userNhan1=await conversationResponse?.members.filter((value) => value._id !== currentUser?.uid)[0]
        conversationId1=conversationId; 
        setIsFirst(false);
        setConversation(conversationResponse);
      } else { 
        userNhan1=await userApis.getUserById(receiverId); 
        conversationId1=CombineUserId(currentUser?.uid, userNhan1._id); 
        setConversationId(conversationId1)
      }

      userNhan1 = await userApis.getUserById(userNhan1._id); 
      me1 = await userApis.getUserById(currentUser?.uid); 
      setUserNhan(userNhan1);
      setMe(me1);
      const chatReponse = await ChatApi.getChatByConversationId(conversationId1);
      setChat(chatReponse)
      // setChat(chatReponse.sort((a, b) => {
      //     return new Date(a.createdAt) - new Date(b.createdAt);
      // }));
    };
    fetchData();
  }, []);

  useEffect(() => { 
    socket.emit("joinRoom", conversationId);
  }, [conversationId, isFirst, socket]);

  useEffect(() => {
    socket.on("getMessage", (chat) => {
      setChatReceived(chat); 
    })
  }, []);

  useEffect(() => {
    if (chatReceived) 
      setChat((prevChats) => [...prevChats, chatReceived]);
  }, [chatReceived])

  const handleSend = async () => {
    if (text == "") return;
    socket.emit("sendMessage", {
      conversationId, 
      senderInfo: {
        _id: currentUser?.uid,
        name: me.name, 
        avatar: me.avatar, 
      },
      content: { text },
      createdAt: new Date(),
    }); 
    setText("");
    await axiosPrivate.post(`/chat`, 
      {
        ...( isFirst ? {receiverId} : {conversationId}), 
        senderId: currentUser?.uid,
        content: { text },
      }
    )
    setIsFirst(false);
  };

  useEffect(() => {
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop ===
      containerRef.current.clientHeight
    ) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const hanldeBtnPhotoClick= () => {
    inputPhotoRef.current.click();
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChat((prevChats) => [
          ...prevChats,
          {
            _id: chats.length + 1,
            conversationId,
            senderId: currentUser?.uid,
            content: { image: reader.result },
            createdAt: new Date(),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const hanldeEmojiClick = (emojiObject, event) => {
    setText((prev) => prev + emojiObject.emoji);
  };
  return (
    <div className="conversationChat">
      <div className="titleHeader">
        <div className="contentTitle">
          <Button className="imgCon">
            <Image
              src={ conversation?.image || userNhan?.avatar}
              className="imgAvt"
              alt=""
              width={50}
              height={50}
            />
          </Button>
          <div className="nameCon">
            <h3 className="nameNhan">
              { conversation?.name || userNhan?.name}
            </h3>
            <div className="timeAccess">
              <div className="lastTime">{lastTime}</div>
              <Divider orientation="vertical" flexItem />
              <IconButton className="btn">
                <BookmarkBorderIcon className="btn" />
              </IconButton>
            </div>
          </div>
        </div>

        <div className="btnContent">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <LocalPhoneOutlinedIcon />
          </IconButton>
          <IconButton>
            <VideocamOutlinedIcon />
          </IconButton>
          <IconButton>
            <WidthNormalIcon />
          </IconButton>
        </div>
      </div>

      <div className="containerChat" ref={containerRef}>
        <div className="chats">
          {
            chats?.map((item) => {
              return (  <div
                key={item._id || item.createdAt}
                className={`chatContent ${
                  item.senderInfo._id === currentUser?.uid ? "myChat" : "yourChat"
                }`}
              >
                {item.senderInfo._id !== currentUser?.uid && (
                  <div className="imgSender">
                    <Image src={item.senderInfo.avatar} className="imgAvtSender" alt="" width={50} height={50}/>
                  </div>
                )}
                <div className="chat">
                  {item.senderInfo._id !== currentUser?.uid && (
                    <p className="chatName">{item.senderInfo.name}</p>
                  )}
                  {item.content.text ? (
                    <p className="chatContext" style={{ whiteSpace: "pre-wrap" }}>
                      {item.content.text}
                    </p>
                  ) : (
                    <Image
                      src={item.content.image}
                      alt="Chat"
                      className="chatImg"
                    />
                  )}
                  {/* check hour, giờ, userSend */}
                  <p className="chatTime">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>)
            })
          }
        </div>
        <div ref={endRef} />
      </div>

      <div className="sendChat">
        <div className="itemChat">
          <Button>
            <KitesurfingIcon />
          </Button>
          <div
            style={{
              width: "1.5px",
              backgroundColor: "gray",
              margin: "7px 0",
            }}
          />
          <Button>
            <input
              ref={inputPhotoRef}
              style={{ display: "none" }}
              accept="image/*,video/*"
              type="file"
              multiple={true}
              onChange={handleFileChange}
            />
            <PhotoSizeSelectActualOutlinedIcon onClick={hanldeBtnPhotoClick} />
          </Button>
          <div
            style={{
              width: "1.5px",
              backgroundColor: "gray",
              margin: "7px 0",
            }}
          />
          <Button>
            <AttachmentOutlinedIcon />
          </Button>
          <div
            style={{
              width: "1.5px",
              backgroundColor: "gray",
              margin: "7px 0",
            }}
          />
          <Button>
            <ContactEmergencyOutlinedIcon />
          </Button>
        </div>
        <div className="sendChatContent">
          <Input
            className="inputChat"
            autoFocus={true}
            placeholder="Nhập tin nhắn"
            minRows={1}
            maxRows={5}
            multiline={true}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <div className="btnContent">
            <Button>
              <AlternateEmailIcon />
            </Button>
            <Button
              style={{ backgroundColor: openEmoji ? "#0091E1" : "white" }}
              onClick={() => setOpenEmoji(!openEmoji)}
            >
              <SentimentVerySatisfiedIcon />
            </Button>
            <Button className="btnGui" onClick={() => handleSend()}>
              {text == "" ? <ThumbUpIcon sx={{ color: "black" }} /> : "Gửi"}
            </Button>

            {openEmoji && (
              <div>
                <EmojiPicker
                  onEmojiClick={hanldeEmojiClick}
                  className="blockEmoji"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
