/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { IconButton, Input, Tooltip } from "@mui/material";
import Button from "@/components/Button";
import ReactPlayer from "react-player";
import mime from "mime";
import {
  Popover,
  Spin,
  Upload,
  Modal,
  Flex,
  Checkbox,
  Row,
  Col,
  Image,
} from "antd";
import InputAntd from "antd/lib/input";
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
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { MoreHoriz, Search } from "@mui/icons-material";
import ReplyIcon from "@mui/icons-material/Reply";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Divider from "@mui/material/Divider";
import { AuthContext } from "@/context/AuthProvider";
import ConversationApi from "@/apis/ConversationApi";
import ChatApi from "@/apis/ChatApi";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";
import { SocketContext } from "@/context/SocketProvider";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import formatFileSize from "@/utils/formatFileSize";
import userApis from "@/apis/userApis";
import CombineUserId from "@/utils/CombineUserId";
import axiosPrivate from "@/apis/axios";
import { Typography } from "antd";
import UserConversationApi from "@/apis/userConversationApi";
import ModalProfileUser from "@/components/ModalProfileUser";
import { useSocket } from "@/context/SocketProvider";
import openNotificationWithIcon from "@/components/OpenNotificationWithIcon";
import { useMutation } from "react-query";
import FriendApi from "@/apis/FriendApi";
import imageDefault from "@/constants/imgDefault";
import { set } from "date-fns";
import ModalSettingGroup from "@/components/ModalSettingGroup";

const lastTime = "Truy cập 1 phút trước";

const page = ({ params }) => {
  const receiverId = params.id;
  const router = useRouter();
  const currentUser = useContext(AuthContext);

  const { Text } = Typography;
  const endRef = useRef();
  // const inputPhotoRef = useRef();
  // const inputFileRef = useRef();
  const containerRef = useRef();
  const { socket } = useSocket();

  const [conversationId, setConversationId] = useState(params.id);
  const [currentConversation, setCurrentConversation] = useState(null);

  const [conversation, setConversation] = useState(null); //[currentUser?.uid, receiverId
  const [text, setText] = useState("");
  const [userNhan, setUserNhan] = useState({});
  const [chats, setChat] = useState([]);
  const [chatReceived, setChatReceived] = useState(null);
  const [isOpenEmoji, setOpenEmoji] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [me, setMe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [openPopover, setOpenPopover] = useState(false);
  const [openModalForward, setOpenModalForward] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [forwardSelected, setForwardSelected] = useState([]);
  const [friends, setFriends] = useState([]);
  const [itemForward, setItemForward] = useState();

  // Xử lý sự kiện click để mở modal thông tin của userNhan
  const handleOpenModal = async (id) => {
    //check group/couple
    if (typeof id === "object") setUserProfile(userNhan);
    else {
      const user = await userApis.getUserById(id);
      setUserProfile(user);
    }
    setShowModalProfile(true);
  };

  const handleCloseModal = () => {
    setShowModalProfile(false);
  };

  const [openModalSettingGroup, setOpenModalSettingGroup] = useState(false);
  const [isGroupConversation, setIsGroupConversation] = useState(false);

  const handleOpenModalSettingGroup = () => {
    if (isGroupConversation) {
      setOpenModalSettingGroup(true);
    } else {
      console.log("Chỉ group được mở modal");
    }
  };

  const handleCloseModalSettingGroup = () => {
    setOpenModalSettingGroup(false);
  };

  const { mutate: getFriends } = useMutation(
    "friends",
    UserConversationApi.getUserConversationByUserId,
    {
      onSuccess: (data) => {
        setFriends(data.conversations);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      //fetch user
      const conversationResponse = await ConversationApi.getConversationById(
        conversationId
      );
      let userNhan1 = null;
      let conversationId1 = null;
      let me1 = null;
      if (conversationResponse?._id) {
        userNhan1 = await conversationResponse?.members.filter(
          (value) => value._id !== currentUser?.uid
        )[0];
        conversationId1 = conversationId;
        setIsFirst(false);
        setConversation(conversationResponse);
      } else {
        userNhan1 = await userApis.getUserById(receiverId);
        conversationId1 = CombineUserId(currentUser?.uid, userNhan1?._id);
        setConversationId(conversationId1);
      }

      userNhan1 = await userApis.getUserById(userNhan1?._id);
      // console.log(userNhan1);

      me1 = await userApis.getUserById(currentUser?.uid);
      setUserNhan(userNhan1);
      setMe(me1);
      const chatReponse = await ChatApi.getChatByConversationId(
        conversationId1
      );
      setChat(chatReponse);
      // setChat(chatReponse.sort((a, b) => {
      //     return new Date(a.createdAt) - new Date(b.createdAt);
      // }));
      setIsGroupConversation(conversationResponse?.type === "group");
    };
    fetchData();
    getFriends(currentUser?.uid);
  }, []);

  //chuyển socket joiiRoom ra trang ngoài
  // useEffect(() => {
  //   socket.emit("joinRoom", conversationId);
  // }, [conversationId, isFirst, socket]);

  useEffect(() => {
    socket.on("getMessage", (chat) => {
      // console.log("chat socket: ");
      // console.log(chat);
      setChatReceived(chat);
    });
    socket.on("receive-call", (data) => {
      console.log(data);
      if (data.caller != currentUser?.uid) {
        router.push(`/VideoCall/${data.channel}`);
      }
    });
  }, []);

  useEffect(() => {
    if (chatReceived?.conversationId !== conversationId) return;
    if (chatReceived) setChat((prevChats) => [...prevChats, chatReceived]);
  }, [chatReceived]);

  const handleSend = async () => {
    // socket.emit("sendMessage", {
    //   conversationId,
    //   senderInfo: {
    //     _id: currentUser?.uid,
    //     name: me.name,
    //     avatar: me.avatar,
    //   },
    //   content: text == "" ? { text: "👍" } : { text },
    //   createdAt: new Date(),
    // });
    setText("");
    await axiosPrivate.post(`/chat`, {
      ...(isFirst ? { receiverId } : { conversationId }),
      senderId: currentUser?.uid,
      content: text == "" ? { text: "👍" } : { text },
    });
    setIsFirst(false);
  };

  const downloadFile = (e) => {
    console.log(e.target.href);
    console.log("object", "downloadFile+");
    fetch(e.target.href, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hanldeEmojiClick = (emojiObject, event) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const copyClipBoard = (text) => () => {
    navigator.clipboard.writeText(text);
    setOpenPopover(false);
  };

  const showFunctionChat = (item) => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          onClick={() => {
            setOpenModalForward(true);
            setOpenPopover(false);
            setItemForward(item.content);
          }}
          hidden={item.type === "deleted"}
        >
          <ReplyIcon style={{ marginRight: "8px" }} /> Forward
        </Button>
        {item.content.text !== undefined ? (
          <Button onClick={copyClipBoard(item.content.text)}>
            <ContentCopyOutlinedIcon style={{ marginRight: "8px" }} /> Copy text
          </Button>
        ) : (
          <a href={`${item.content.file.url}`} download>
            <Button width={"100%"} onClick={() => setOpenPopover(false)}>
              <FileDownloadOutlinedIcon style={{ marginRight: "8px" }} />
              Download
            </Button>
          </a>
        )}
        <Button
          color="red"
          onClick={() => {
            setChat((prev) => prev.filter((chat) => chat._id !== item._id));
            ChatApi.deleteMessage(item._id);
            setOpenPopover(false);
            openNotificationWithIcon("success", "Delete message success");
          }}
        >
          <DeleteForeverOutlinedIcon style={{ marginRight: "8px" }} />
          Delete for my only
        </Button>
        <Button
          hidden={item.senderId !== currentUser?.uid || item.type === "deleted"}
          color="red"
          onClick={async () => {
            const response = await ChatApi.recallMessage(item._id);
            setChat((prev) =>
              prev.map((chat) => (chat._id === item._id ? response : chat))
            );
            openNotificationWithIcon("success", "Recall message success");
            setOpenPopover(false);
          }}
        >
          <ReplayOutlinedIcon style={{ marginRight: "8px" }} />
          Recall
        </Button>
      </div>
    );
  };

  const checkIconFile = (item) => {
    if (!item) return;
    // console.log(item);
    const file = item.content?.file.name?.split(".");
    const type = file[file?.length - 1];
    // const type = "a";
    const wordExtensions = ["doc", "docm", "docx", "dot", "dotx"];
    const excelExtensions = [
      "xls",
      "xlsx",
      "xlsm",
      "xlsb",
      "xlt",
      "xltm",
      "xltx",
      "xla",
      "xlam",
      "xll",
      "xlw",
      "csv",
    ];
    const powerpointExtensions = [
      "ppt",
      "pptx",
      "pptm",
      "pot",
      "potx",
      "potm",
      "ppam",
      "ppa",
      "pps",
      "ppsx",
      "ppsm",
    ];
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "svg",
      "webp",
    ];
    const videoExtensions = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];

    if (videoExtensions.includes(type))
      return "https://cdn-icons-png.flaticon.com/128/3074/3074767.png";
    if (imageExtensions.includes(type))
      return "https://cdn-icons-png.flaticon.com/128/1375/1375106.png";
    if (wordExtensions.includes(type))
      return "https://cdn-icons-png.flaticon.com/128/888/888883.png";
    if (excelExtensions.includes(type))
      return "https://cdn-icons-png.flaticon.com/128/888/888850.png";
    if (powerpointExtensions.includes(type))
      return "https://cdn-icons-png.flaticon.com/128/888/888874.png";
    if (type == "pdf")
      return "https://cdn-icons-png.flaticon.com/128/337/337946.png";
    return "https://cdn-icons-png.flaticon.com/128/3073/3073412.png";
  };

  const handleFileChange = async (info) => {
    const videoExtensions = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];

    if (info.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(info.file);
        const file = info?.file.name?.split(".");
        const type = file[file?.length - 1];
        // console.log(videoExtensions.includes(type) ? "video" : "file");
        const fmData = new FormData();
        fmData.append("file", info.file);
        ChatApi.sendFile(
          fmData,
          // "file",
          videoExtensions.includes(type) ? "video" : "file",
          conversationId,
          currentUser?.uid
        )
          .then((data) => {
            console.log(data);
          })
          .catch((error) =>
            openNotificationWithIcon(
              "error",
              "Error",
              "You can only send a maximum of 20MB"
            )
          );
      };
      reader.readAsDataURL(info.file);
    }
  };

  const handleImgChange = async (info) => {
    try {
      if (info.file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fmData = new FormData();
          fmData.append("file", info.file);
          ChatApi.sendFile(fmData, "image", conversationId, currentUser?.uid)
            .then((data) => {
              console.log(data);
            })
            .catch((error) =>
              openNotificationWithIcon(
                "error",
                "Error",
                "You can only send a maximum of 20MB"
              )
            );
          // socket.emit("sendMessage", {
          //   conversationId,
          //   senderId: currentUser?.uid,
          //   content: { image: reader.result },
          //   senderInfo: {
          //     _id: currentUser?.uid,
          //     name: me.name,
          //     avatar: me.avatar,
          //   },
          //   createdAt: new Date(),
          // });
        };
        reader.readAsDataURL(info.file);
      }
    } catch (error) {
      openNotificationWithIcon(
        "error",
        "Error",
        "You can only send a maximum of 20MB"
      );
    }
  };

  const hanldForward = async () => {
    for (let item of forwardSelected) {
      await axiosPrivate.post(`/chat`, {
        conversationId: item.conversationId,
        senderId: currentUser?.uid,
        content: itemForward,
      });
    }

    setOpenModalForward(false);
    setForwardSelected([]);
  };

  const formatSizeFile = (size) => {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const showManyImage = (images) => {
    // const te = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {},];
    return (
      <Row gutter={[4, 4]} style={{ width: "360px" }}>
        {images.map((value, index) => {
          return (
            <Col span={8} key={index}>
              <Image src={value.url} height={120} width={120} />
            </Col>
          );
        })}
      </Row>
    );
  };

  const dataFriends = friends
    .sort((a, b) =>
      (a?.name || a.user?.name)?.localeCompare(b?.name || b.user?.name)
    )
    .filter((friend) => {
      return (friend?.name || friend.user?.name)
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());
    });

  const handleCallVideo = (conversationId) => {
    console.log("object: ", {
      channel: conversationId,
      caller: currentUser.uid,
    });
    socket.emit("video-call", {
      channel: conversationId,
      caller: currentUser.uid,
    });
    router.push(`/VideoCall/${conversationId}`);
  };

  return (
    <div className="conversationChat">
      {/* <Spin spinning={false}> */}
      <div className="titleHeader">
        <div className="contentTitle">
          <Button className="imgCon" onClick={handleOpenModal}>
            <img
              src={conversation?.image || userNhan?.avatar}
              className="imgAvt"
              alt=""
              width={50}
              height={50}
            />
          </Button>

          <ModalProfileUser
            isOpen={showModalProfile}
            onClose={handleCloseModal}
            user={userProfile}
          />

          <div className="nameCon">
            <h3 className="nameNhan">{conversation?.name || userNhan?.name}</h3>
            <div className="timeAccess">
              <div className="lastTime">{lastTime}</div>
              <Divider orientation="vertical" flexItem />
              <Button borderRadius="40%" margin="0" padding="0">
                <BookmarkBorderIcon className="btn" />
              </Button>
            </div>
          </div>
        </div>

        <div className="btnContent">
          <Button>
            <Search />
          </Button>
          <Button>
            <LocalPhoneOutlinedIcon />
          </Button>
          <Button onClick={() => handleCallVideo(conversationId)}>
            <VideocamOutlinedIcon />
          </Button>
          <Button onClick={handleOpenModalSettingGroup}>
            <WidthNormalIcon />
          </Button>
        </div>
      </div>
      <ModalSettingGroup
        visible={openModalSettingGroup}
        onCancel={handleCloseModalSettingGroup}
        conversationId={conversationId}
      />

      <div className="containerChat" ref={containerRef}>
        <div className="chats">
          {chats !== undefined && chats?.map((item, index) => {
            if (item.deletedFor?.includes(currentUser?.uid))
              return (
                <div
                  key={
                    item._id || Date.parse(item.createdAt).toString() + index
                  }
                  style={{ display: "none" }}
                />
              );
            return (
              <div
                key={item._id || Date.parse(item.createdAt).toString() + index}
                className={`chatContent ${
                  item.senderId === me?._id ? "myChat" : "yourChat"
                }`}
              >
                {item.senderId !== me?._id && (
                  <div className="imgSender">
                    {(index === 0 ||
                      item.senderId != chats[index - 1]?.senderId) && (
                      <img
                        src={item.senderInfo?.avatar}
                        className="imgAvtSender"
                        onClick={() => handleOpenModal(item.senderId)}
                      />
                    )}
                  </div>
                )}
                <Popover
                  arrow={false}
                  placement={
                    item.senderId !== me?._id ? "rightBottom" : "leftBottom"
                  }
                  content={
                    <Popover
                      arrow={false}
                      open={openPopover}
                      placement={
                        item.senderId !== me?._id ? "topLeft" : "topRight"
                      }
                      content={() => showFunctionChat(item)}
                      onOpenChange={(newOpen) => setOpenPopover(newOpen)}
                      trigger="click"
                    >
                      <MoreHoriz
                        style={{
                          padding: "1px",
                          backgroundColor: "transparent",
                          height: "20px",
                        }}
                        fontSize="small"
                      />
                    </Popover>
                  }
                >
                  <div
                    className="chat"
                    color={"#2db7f5"}
                    style={{
                      backgroundColor:
                        item.senderId === me?._id ? "#E5EFFF" : "white",
                    }}
                  >
                    <div>
                      {item.senderId !== me?._id && (
                        <p className="chatName">{item.senderInfo?.name}</p>
                      )}
                      {item.content.text !== undefined ? (
                        <p
                          className="chatText"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {item.type === "deleted"
                            ? "Tin nhắn đã bị thu hồi"
                            : item.content.text}
                        </p>
                      ) : item.content?.image ? (
                        <img
                          src={item.content.image}
                          alt="Chat"
                          className="chatImg"
                        />
                      ) : item.content?.file?.url ? (
                        <div className="chatFile">
                          <img
                            src={checkIconFile(item)}
                            alt="word"
                            className="iconFile"
                          />
                          <div className="fileContent">
                            <Text
                              style={{
                                maxWidth: "95%",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                              ellipsis={{
                                suffix: item.content?.file.name
                                  .slice(-6)
                                  .trim(),
                                tooltip: (
                                  <div style={{ fontSize: "10px" }}>
                                    {item.content?.file.name}
                                  </div>
                                ),
                              }}
                            >
                              {item.content?.file.name.slice(
                                0,
                                item.content?.file.name.length - 6
                              )}
                            </Text>
                            <p>{formatSizeFile(item.content?.file.size)}</p>
                          </div>
                          <a href={item.content?.file.url} download>
                            <FileDownloadOutlinedIcon className="iconT" />
                          </a>
                        </div>
                      ) : item.content?.video ? (
                        <ReactPlayer
                          url={item.content.video}
                          controls={true}
                          maxWidth="300px"
                          style={{ resize: "cover" }}
                        />
                      ) : (
                        showManyImage(item.content.images)
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
                </Popover>
              </div>
            );
          })}
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
          <Button padding="8px 10px">
            <KitesurfingIcon />
          </Button>
          <Upload
            accept="image/*"
            progress
            onChange={handleImgChange}
            fileList={[]}
            multiple={true}
            beforeUpload={() => false}
            showUploadList={false}
          >
            <Button padding="8px 10px">
              <PhotoSizeSelectActualOutlinedIcon />
            </Button>
          </Upload>
          <Upload
            progress
            onChange={handleFileChange}
            fileList={[]}
            multiple={true}
            beforeUpload={() => false}
            showUploadList={false}
          >
            <Button padding="8px 10px">
              <AttachmentOutlinedIcon />
            </Button>
          </Upload>
          <Button padding="8px 10px">
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
              style={{ backgroundColor: isOpenEmoji ? "#0091E1" : "white" }}
              onClick={() => setOpenEmoji(!isOpenEmoji)}
            >
              <SentimentVerySatisfiedIcon />
            </Button>
            <Button className="btnGui" onClick={handleSend}>
              {text == "" ? <ThumbUpOutlinedIcon color="primary" /> : "Send"}
            </Button>
            <EmojiPicker
              onEmojiClick={hanldeEmojiClick}
              className={`blockEmoji ${isOpenEmoji ? "" : "hiddenBlock"}`}
            />
          </div>
        </div>
      </div>

      <Modal
        open={openModalForward}
        title={<h3>Share</h3>}
        width={"400px"}
        // onOk={() => console.log(forwardSelected)}
        onOk={hanldForward}
        onCancel={() => setOpenModalForward(false)}
      >
        <Flex
          vertical={true}
          style={{
            maxHeight: "55vh",
            minHeight: "55vh",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <InputAntd
            size="middle"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearchChange}
            prefix={
              <Search
                style={{
                  fontSize: "20px",
                  zIndex: 1,
                  position: "sticky",
                  top: 0,
                }}
              />
            }
          />
          <Checkbox.Group
            style={{
              width: "100%",
              // height: "100%",
              marginTop: "10px",
              flexGrow: 1,
              overflow: "auto",
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onChange={setForwardSelected}
          >
            <Flex
              vertical={true}
              style={{
                width: "100%",
                // maxHeight: "100%",
                overflow: "auto",
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              gap={5}
            >
              {friends.length == 0 && <p>Empty</p>}
              {dataFriends.map((item, index) => (
                <Checkbox
                  key={index}
                  // style={{ width: "100%" }}
                  value={item}
                  className="forwardFriend"
                >
                  <Flex align="center" gap={10}>
                    <img
                      src={item?.user ? item.user?.avatar : item?.image}
                      alt=""
                      width={45}
                      height={45}
                      style={{ borderRadius: "50%" }}
                    />
                    <p>{item?.name || item.user.name}</p>
                  </Flex>
                </Checkbox>
              ))}
            </Flex>
          </Checkbox.Group>
        </Flex>
      </Modal>

      {/* </Spin> */}
    </div>
  );
};

export default page;
