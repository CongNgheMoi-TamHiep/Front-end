/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
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
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Divider from "@mui/material/Divider";
import { AuthContext } from "@/context/AuthProvider";
import ConversationApi from "@/apis/ConversationApi";
import ChatApi from "@/apis/ChatApi";
import UserConversationApi from "@/apis/userConversationApi";
import { Col, Spin, Upload, UploadProps } from "antd";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";
import { SocketContext } from "@/context/SocketProvider";
import { useMutation } from "react-query";
const lastTime = "Truy cập 1 phút trước";

// socket.emit('addUser', auth.get);

const page = ({ params }) => {
  const conversationId = params.id;
  const router = useRouter();
  const currentUser = React.useContext(AuthContext);

  const endRef = useRef();
  const inputPhotoRef = useRef();
  const containerRef = useRef();
  const socket = useContext(SocketContext);

  const [text, setText] = useState("");
  const [me, setMe] = useState();
  const [userNhan, setUserNhan] = useState([]);
  const [conversation, setConversation] = useState({});
  const [chats, setChat] = useState([]);
  const [img, setImg] = useState([]);
  const [openEmoji, setOpenEmoji] = useState(false);

  // const { mutate: getChat } = useMutation(
  //   "getChat",
  //   ChatApi.getChatByConversationId(conversationId)
  // );

  useEffect(() => {
    const fetchData = async () => {
      //fetch user
      const conversationResponse = await ConversationApi.getConversationById(
        conversationId
      );
      setConversation(conversationResponse);
      // console.log(conversationResponse.data, conversationId,currentUser);
      setMe(
        conversationResponse.members.find(
          (value) => value._id == currentUser.uid
        )
      );
      setUserNhan(
        conversationResponse.members.filter(
          (value) => value._id !== currentUser.uid
        )
      );
      // Array.prototype.filter((value)=>value._id == currentUser.uid)

      //fetch chats
      const chatReponse = await ChatApi.getChatByConversationId(conversationId);
      // console.log(
      //   chatReponse.data.sort((a, b) => {
      //     return new Date(a.createdAt) - new Date(b.createdAt);
      //   })
      // );
      setChat(
        chatReponse.sort((a, b) => {
          // return new Date(b.createdAt) - new Date(a.createdAt);
          return new Date(a.createdAt) - new Date(b.createdAt);
        })
      );
    };
    fetchData();
    socket.emit("joinRoom", conversationId);
    socket.on("getMessage", (chat) => {
      console.log(chat);
      console.log(chats);
      if (chat.createdAt !== chats[chats.length - 1]?.createdAt) {
        setChat((prevChats) => [...prevChats, chat]);
      }
    });
  }, []);

  // useEffect(() => {
  //   // Xử lý sự kiện socket ở đây
  //   socket.emit("joinRoom", conversationId);
  //   socket.on("getMessage", (chat) => {
  //     console.log(chats);
  //     if (chat.createdAt !== chats[chats.length - 1]?.createdAt) {
  //       setChat((prevChats) => [...prevChats, chat]);
  //     }
  //   });
  // }, []);

  const [idUserLastChat, setIdUserLastChat] = useState(
    chats[0]?.senderInfo._id
  );

  const handleSend = async () => {
    if (text == "") return;
    socket.emit("sendMessage", {
      conversationId,
      senderInfo: me,
      content: { text: text == "" ? "👍" : text },
      createdAt: new Date(),
    });
    setText("");

    const chat = await ChatApi.sendChatSingle(
      {
        conversationId,
        senderInfo: me,
        content: { text: text == "" ? "👍" : text },
      },
      conversation.members
    );
    // console.log("chat: ")
    // console.log(chat);
    // setChat([...chats, chat]);
  };

  useEffect(() => {
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop ===
      containerRef.current.clientHeight
    ) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  function hanldeBtnPhotoClick() {
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
            senderInfo: me,
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
  // console.log(chats, "chats")

  return (
    <div className="conversationChat">
      <div className="titleHeader">
        <div className="contentTitle">
          <Button className="imgCon">
            <img
              src={userNhan.length == 1 ? userNhan[0].avatar : ""}
              className="imgAvt"
            />
          </Button>
          <div className="nameCon">
            <h3 className="nameNhan">
              {userNhan.length == 1 ? userNhan[0].name : "group"}
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
          {chats?.map((item) => (
            <div
              key={item._id}
              className={`chatContent ${
                item.senderInfo._id === me?._id ? "myChat" : "yourChat"
              }`}
            >
              {item.senderInfo._id !== me?._id && (
                <div className="imgSender">
                  <img src={item.senderInfo.avatar} className="imgAvtSender" />
                </div>
              )}
              <div className="chat">
                {item.senderInfo._id !== me?._id && (
                  <p className="chatName">{item.senderInfo.name}</p>
                )}
                {item.content.text ? (
                  <p className="chatContext" style={{ whiteSpace: "pre-wrap" }}>
                    {item.content.text}
                  </p>
                ) : (
                  <img
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
            </div>
          ))}
          {/* {img.map((chat, index) => (
            <img
              key={index}
              src={chat}
              alt="Chat"
              className="chatContent myChat imgChat"
              // style={{ width: "30px" }}
            />
          ))} */}
          {/* <div className="block" /> */}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSend();
                e.preventDefault();
              }
            }}
          />
          <div className="btnContent">
            <Button onClick={() => console.log(chats)}>
              <AlternateEmailIcon />
            </Button>
            <Button
              style={{ backgroundColor: openEmoji ? "#0091E1" : "white" }}
              onClick={() => setOpenEmoji(!openEmoji)}
            >
              <SentimentVerySatisfiedIcon />
            </Button>
            <Button className="btnGui" onClick={handleSend}>
              {text == "" ? <ThumbUpOutlinedIcon color="primary" /> : "Gửi"}
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
