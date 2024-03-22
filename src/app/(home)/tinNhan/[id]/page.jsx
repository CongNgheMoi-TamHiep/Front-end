/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Button, IconButton, Input, Tooltip } from "@mui/material";
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
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
import Test from "../../../../components/Test";
const lastTime = "Truy cập 1 phút trước";

// socket.emit('addUser', auth.get);

const page = ({ params }) => {
  const conversationId = params.id;
  const router = useRouter();
  const currentUser = React.useContext(AuthContext);

  const endRef = useRef();
  const inputPhotoRef = useRef();
  const inputFileRef = useRef();
  const containerRef = useRef();
  const socket = useContext(SocketContext);

  const [text, setText] = useState("");
  const [me, setMe] = useState();
  const [userNhan, setUserNhan] = useState([]);
  const [conversation, setConversation] = useState({});
  const [chats, setChat] = useState([]);
  const [chatReceived, setChatReceived] = useState(null);
  const [img, setImg] = useState([]);
  const [isOpenEmoji, setOpenEmoji] = useState(false);

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

      //fetch chats
      const chatReponse = await ChatApi.getChatByConversationId(conversationId);
      setChat(
        chatReponse.sort((a, b) => {
          // return new Date(b.createdAt) - new Date(a.createdAt);
          return new Date(a.createdAt) - new Date(b.createdAt);
        })
      );
    };
    fetchData();

    socket.on("getMessage", (chat) => {
      setChatReceived(chat);
    });
  }, []);

  useEffect(() => {
    socket.emit("joinRoom", conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (chatReceived) {
      setChat((prevChats) => [...prevChats, chatReceived]);
    }
  }, [chatReceived]);

  const handleSend = () => {
    socket.emit("sendMessage", {
      conversationId,
      senderInfo: me,
      content: { text: text == "" ? "👍" : text },
      createdAt: new Date(),
    });

    // const chat =
    ChatApi.sendChatSingle(
      {
        conversationId,
        senderInfo: me,
        content: { text: text == "" ? "👍" : text },
        createdAt: new Date(),
      },
      conversation.members
    );

    setText("");
    // console.log("chat: ")
    // console.log(chat);
    // setChat([...chats, chat]);
  };

  // useEffect(() => {
  //   if (
  //     containerRef.current.scrollHeight - containerRef.current.scrollTop ===
  //     containerRef.current.clientHeight
  //   ) {
  //     endRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [chats]);

  function hanldeBtnPhotoClick() {
    inputPhotoRef.current.click();
  }

  function hanldeBtnFileClick() {
    inputFileRef.current.click();
  }

  const handlePhotoSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setChat((prevChats) => [
          ...prevChats,
          {
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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setChat((prevChats) => [
          ...prevChats,
          {
            conversationId,
            senderInfo: me,
            content: { file: reader.result },
            createdAt: new Date(),
          },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  const downloadFile = (event) => {
    event.preventDefault();
    const url =
      "https://drive.google.com/file/d/1og0LH1ZNR-pB4EsejyPLv272zW_TUydm/view?usp=sharing"; // Thay thế bằng URL tải xuống thực của bạn
    const link = document.createElement("a");
    link.href = url;
    link.download = "file"; // Tên tệp tải xuống, bạn có thể thay đổi nó theo ý muốn
    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
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
              key={item._id || Date.parse(item.createdAt).toString()}
              className={`chatContent ${
                item.senderInfo._id === me?._id ? "myChat" : "yourChat"
              }`}
            >
              {item.senderInfo._id !== me?._id && (
                <div className="imgSender">
                  <img src={item.senderInfo.avatar} className="imgAvtSender" />
                </div>
              )}
              <Tooltip
                className="chat"
                color={"#2db7f5"}
                style={{
                  backgroundColor:
                    item.senderInfo._id === me?._id ? "#E5EFFF" : "white",
                }}
                title={
                  <MoreHorizIcon
                    style={{ padding: "1px", backgroundColor: "#2db7f5" }}
                    fontSize="small"
                  />
                }
                placement={
                  item.senderInfo._id !== me?._id ? "right-end" : "left-end"
                }
              >
                <div>
                  {item.senderInfo._id !== me?._id && (
                    <p className="chatName">{item.senderInfo.name}</p>
                  )}
                  {item.content.text ? (
                    <p className="chatText" style={{ whiteSpace: "pre-wrap" }}>
                      {item.content.text}
                    </p>
                  ) : (
                    // <img
                    //   src={item.content.image}
                    //   alt="Chat"
                    //   className="chatImg"
                    // />
                    <div className="chatFile">
                      <img
                        src={item.content.image}
                        alt="word"
                        className="iconFile"
                      />
                      <div className="fileContent">
                        <p>Name file</p>
                        <p>45 MB</p>
                      </div>
                      <a href="javascript:void(0)" onClick={downloadFile}>
                        <FileDownloadOutlinedIcon className="iconT" />
                      </a>
                    </div>
                  )}
                  {/* check hour, giờ, userSend */}
                  <p className="chatTime">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Tooltip>
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
          <Button onClick={hanldeBtnPhotoClick}>
            <PhotoSizeSelectActualOutlinedIcon />
          </Button>
          <div
            style={{
              width: "1.5px",
              backgroundColor: "gray",
              margin: "7px 0",
            }}
          />
          <Button onClick={hanldeBtnFileClick}>
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
          <input
            ref={inputPhotoRef}
            style={{ display: "none" }}
            accept="image/*,video/*"
            type="file"
            multiple={true}
            onChange={handlePhotoSelect}
          />
          <input
            ref={inputFileRef}
            style={{ display: "none" }}
            accept="*/*"
            type="file"
            multiple={true}
            onChange={handlePhotoSelect}
          />
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
              style={{ backgroundColor: isOpenEmoji ? "#0091E1" : "white" }}
              onClick={() => setOpenEmoji(!isOpenEmoji)}
            >
              <SentimentVerySatisfiedIcon />
            </Button>
            <Button className="btnGui" onClick={handleSend}>
              {text == "" ? <ThumbUpOutlinedIcon color="primary" /> : "Gửi"}
            </Button>
            {/* EmojiPicker */}
            <EmojiPicker
              onEmojiClick={hanldeEmojiClick}
              // className={`blockEmoji`}
              className={`blockEmoji ${isOpenEmoji ? "" : "hiddenBlock"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
