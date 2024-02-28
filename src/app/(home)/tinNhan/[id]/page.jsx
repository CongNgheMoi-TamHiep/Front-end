/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useParams, useRouter } from "next/router";
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
import UserConversationApi from "@/apis/userConversationApi";

// chat = {_id: string,
//   conversationId: string,
//   senderInfo: {_id, avatar, name},
//   content: {text, image:, audio , file: }
//   createdAt: date
// }
const chatss = [
  {
    _id: "a2",
    conversationId: "1",
    senderInfo: {
      _id: "y8bYgJmzJ1hROg7PhIIXWvHw1CN2",
      avatar:
        "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_4_resize.jpg",
      name: "Huỳnh Khương Anh",
    },
    content: {
      text: "start_it-scrollbar { &::-",
    },
    createdAt: "2022-10-10T10:00:00.000Z",
  },
  {
    _id: "a",
    conversationId: "1",
    senderInfo: {
      _id: "1",
      avatar:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
    },
    content: {
      text: "vcl lun đừng làm thế mà :33",
    },
    createdAt: "2022-10-10T10:00:00.000Z",
  },
  {
    _id: "a4",
    conversationId: "1",
    senderInfo: {
      _id: "1",
      avatar:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
    },
    content: {
      text: "ádlbar { display: none; /* For Chrome, Safari and Opera */",
    },
    createdAt: "2022-10-10T10:01:00.000Z",
  },
  {
    _id: "b2",
    conversationId: "1",
    senderInfo: {
      _id: "y8bYgJmzJ1hROg7PhIIXWvHw1CN2",
      avatar:
        "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_4_resize.jpg",
      name: "Huỳnh Khương Anh",
    },
    content: {
      text: "it-scrollbar { &::-",
    },
    createdAt: "2022-10-10T10:00:00.000Z",
  },
  {
    _id: "b3",
    conversationId: "1",
    senderInfo: {
      _id: "1",
      avatar:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
    },
    content: {
      text: "vcl lun đừng làm thế mà :33",
    },
    createdAt: "2022-10-10T10:00:00.000Z",
  },
  {
    _id: "b4",
    conversationId: "1",
    senderInfo: {
      _id: "1",
      avatar:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
    },
    content: {
      text: "ádlbar { display: none; /* For Chrome, Safari and Opera */",
    },
    createdAt: "2022-10-10T10:01:00.000Z",
  },
  {
    _id: "1",
    conversationId: "1",
    senderInfo: {
      _id: "1",
      avatar:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
    },
    content: {
      text: "abc gần rồi...",
    },
    createdAt: "2022-10-10T10:00:00.000Z",
  },
  {
    _id: "2",
    conversationId: "1",
    senderInfo: {
      _id: "y8bYgJmzJ1hROg7PhIIXWvHw1CN2",
      avatar:
        "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_4_resize.jpg",
      name: "Huỳnh Khương Anh",
    },
    content: {
      text: "it-scrollbar { &::-",
    },
    createdAt: "2022-10-10T10:00:00.000Z",
  },
  {
    _id: "3",
    conversationId: "1",
    senderInfo: {
      _id: "1",
      avatar:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
    },
    content: {
      text: "vcl lun đừng làm thế mà :33",
    },
    createdAt: "2022-10-10T10:00:00.000Z",
  },
  {
    _id: "4",
    conversationId: "1",
    senderInfo: {
      _id: "1",
      avatar:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Lê Thanh Tùng",
    },
    content: {
      text: "end_ádlbar { display: none; /* For Chrome, Safari and Opera */",
    },
    createdAt: "2022-10-10T10:01:00.000Z",
  },
];

// Conversation={
//   _id: string,
//   type: string (group/couple),
//   members: [ {_id, name, avatar}, ... ],
//   name: (if group)
// }
// const conversation = {
//   _id: "1",
//   type: "couple",
//   members: [
//     {
//       _id: "1",
//       name: "Lê Thanh Tùng",
//       avatar:
//         "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
//     },
//     {
//       _id: "2",
//       name: "Huỳnh Khương Anh",
//       avatar:
//         "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_4_resize.jpg",
//     },
//   ],
// };

// const me = {
//   _id: "1",
//   avatar:
//     "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
//   name: "Lê Thanh Tùng",
// };
// const userNhan =
//   conversation.type == "couple"
//     ? conversation.members[0]
//     : { name: conversation.name, avatar: conversation.avatar };

const lastTime = "Truy cập 1 phút trước";

const page = ({ params }) => {
  const conversationId = params.id;
  const currentUser = React.useContext(AuthContext);
  const endRef = useRef();
  const containerRef = useRef();
  const [text, setText] = useState("");
  const [me, setMe] = useState();
  const [userNhan, setUserNhan] = useState([]);
  const [conversation, setConversation] = useState({});
  const [chats, setChat] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      //fetch user
      const conversationResponse = await ConversationApi.getConversationById(
        conversationId
      );
      setConversation(conversationResponse.data);
      // console.log(conversationResponse.data, conversationId,currentUser);
      setMe(
        conversationResponse.data.members.find(
          (value) => value._id == currentUser.uid
        )
      );
      setUserNhan(
        conversationResponse.data.members.filter(
          (value) => value._id !== currentUser.uid
        )
      );
      // Array.prototype.filter((value)=>value._id == currentUser.uid)

      //fetch chats
      const chatReponse = await ChatApi.getChatByConversationId(conversationId);
      console.log(
        chatReponse.data.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        })
      );
      setChat(
        chatReponse.data.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        })
      );
    };
    fetchData();
  }, []);

  const [idUserLastChat, setIdUserLastChat] = useState(
    chats[0]?.senderInfo._id
  );

  const handleSend = async () => {
    if (text == "") return;
    const chat = await ChatApi.sendChatSingle(
      {
        conversationId,
        senderInfo: me,
        content: { text },
      },
      conversation.members
    );

    console.log(chat?.data);
    chats.push(chat?.data);
    setText("");
  };

  useEffect(() => {
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop ===
      containerRef.current.clientHeight
    ) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

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
                <Button className="imgSender" style={{ padding: 0, margin: 0 }}>
                  <img src={item.senderInfo.avatar} className="imgAvtSender" />
                </Button>
              )}
              <div className="chat">
                {item.senderInfo._id !== me?._id && (
                  <p className="chatName">{item.senderInfo.name}</p>
                )}
                <p className="chatContext">
                  {
                    item.content.text
                    // + "afasfafffffffffaf ffsfffffafasfafff fffff afasfafffffffffaf asfafffffffffafasfafffff ffffafasfafffff ffffafasfafffffffffafasfafffffffff afasfafffffffffafasfafffffffffafasfaf ffffffffafasfafffffffffafa sfafffffffffafasfafffffffffafasfafff ffffffafasfafffffffff afasfafffffffffaf asfafffffffffafasfafffff ffffafasfafffff ffffafasfafffffffffafasfafffffffff afasfafffffffffafasfafffffffffafasfaf ffffffffafasfafffffffffafa sfafffffffffafasfafffffffffafasfafff ffffffafasfafffffffff afasfafffffffffaf asfafffffffffafasfafffff ffffafasfafffff ffffafasfafffffffffafasfafffffffff afasfafffffffffafasfafffffffffafasfaf ffffffffafasfafffffffffafa sfafffffffffafasfafffffffffafasfafff ffffffafasfafffffffff "
                  }
                </p>
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
          {/* <div className="block" /> */}
        </div>
        <div ref={endRef} />
      </div>

      <div className="sendChat">
        <div className="itemChat">
          <Button>
            <KitesurfingIcon />
          </Button>
          <Button>
            <PhotoSizeSelectActualOutlinedIcon />
          </Button>
          <Button>
            <AttachmentOutlinedIcon />
          </Button>
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
            onChange={(e) => setText(e.target.value)}
            // ref={inputRef}
          />
          <div className="btnContent">
            <Button>
              <AlternateEmailIcon />
            </Button>
            <Button>
              <SentimentVerySatisfiedIcon />
            </Button>
            <Button className="btnGui" onClick={() => handleSend()}>
              {text == "" ? <ThumbUpIcon sx={{ color: "black" }} /> : "Gửi"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
