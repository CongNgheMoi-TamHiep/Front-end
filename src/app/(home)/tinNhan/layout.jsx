"use client";
import React, { use, useContext, useEffect, useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import userApis from "@/apis/userApis";
import UserConversationApi from "@/apis/userConversationApi";
import FriendRequest from "@/apis/friendRequest";
import { AuthContext } from "@/context/AuthProvider";
import { SocketContext } from "@/context/SocketProvider";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddSharpIcon from "@mui/icons-material/GroupAddSharp";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import { Col, Input, Row, Space, Modal, Divider, Flex } from "antd";
import { MuiTelInput } from "mui-tel-input";
import ModalConfirmAddFriend from "@/components/ModalConfirmAddFriend";
import { ca } from "date-fns/locale";
import { useSocket } from "../../../context/SocketProvider";

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUser = React.useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [chatReceived, setChatReceived] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [userFind, setUserFind] = useState(undefined);
  const [number, setNumber] = useState("");
  const [openModalCreateGroup, setOpenModalCreateGroup] = useState(false);
  const [openModalAddFriend, setOpenModalAddFriend] = useState(false);
  const [openModalConfirmAddFriend, setOpenModalConfirmAddFriend] = useState(false);
  const {socket} = useSocket(); 
  const [newConversation, setNewConversation] = useState(null);
  const handleRouteToDetailConversation = (item) => {
    setCurrentConversation(item);
    console.log(item.conversationId);
    router.push(`/tinNhan/${item.conversationId}`);
  };

  useEffect(() => {
    socket.on("getMessage", (chat) => {
      setChatReceived(chat);
    });
    socket.on("newConversation", (conversation) => {
      console.log("newConversation: ")
      console.log(conversation)
      setNewConversation(conversation);
    }); 

    const fetchData = async () => {
      const userConversations =
        await UserConversationApi.getUserConversationByUserId(currentUser?.uid);
      console.log(userConversations.conversations);
      console.log("currentUseruid");
      console.log(currentUser?.uid);
      setConversations(userConversations.conversations);

      if (userConversations?.conversations?.length > 0) {
        setCurrentConversation(userConversations.conversations[0]);
      }
      const user1 = await userApis.getUserById(currentUser.uid);
      console.log(user1);
      setUser(user1);
    };

    fetchData();
  }, []);

  useEffect(() => { 
    if (newConversation) {
      setConversations([newConversation, ...conversations]);
    }
  }, [newConversation])

  const getUserFriend = async () => {
    console.log(number.replaceAll(" ", ""));
    const resp = await FriendRequest.getFriendByNumber(
      number.replaceAll(" ", "")
    );
    console.log(resp);
    if (resp?.name !== undefined) {
      const respCheck = await FriendRequest.checkFriend(
        currentUser.uid,
        resp.uid
      );
      resp.state = respCheck;
      setUserFind(resp);
    } else setUserFind(undefined);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getUserFriend();
    }, 300);
    return () => clearTimeout(timer);
  }, [number]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredConversations = conversations?.filter((item) => {
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

  const openModelAddFriend = () => {
    setOpenModalAddFriend(true);
  };

  const openModelCreateGroup = () => {
    setOpenModalCreateGroup(true);
  };

  const checkFriendState = (state) => {
    switch (state) {
      case "pedding1":
        return "Cancel request";
      case "pedding2":
        return "Accept";
      case "declined1":
        return "";
      case "declined2":
        return "Add friend";
      case "accepted":
        return "Call";
      default:
        return "Add friend";
    }
  };

  const buttonAddFriend = ({ key, findGroup, item }) => {
    return (
      <Button
        width="100%"
        key={key}
        onClick={() => {
          // setOpenModalConfirmAddFriend(true);
          // setUserFind()
        }}
      >
        <Row justify={"space-around"} gutter={16} style={{ width: "100%" }}>
          <Col flex={"60px"}>
            <img
              className="avatar-img"
              src={
                item?.avatar ||
                "https://firebasestorage.googleapis.com/v0/b/zalo-78227.appspot.com/o/avatarDefault.jpg?alt=media&token=2b2922bb-ada3-4000-b5f7-6d97ff87becd"
              }
              alt=""
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
            />
          </Col>
          <Col
            flex={"auto"}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "flex-start",
            }}
          >
            <h4>{item?.name}</h4>
            {findGroup ? (
              <p>In group a</p>
            ) : (
              <p>
                Phone number: <span>{number}</span>
              </p>
            )}
          </Col>
          <Col
            flex={"150px"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              padding="2px 18px"
              bgColorHover="#DAE9FF"
              border="1px solid #0068FF"
              color="#0068FF"
              onClick={(e) => {
                e.stopPropagation();
                setOpenModalConfirmAddFriend(true);
              }}
            >
              {checkFriendState(item.state)}
            </Button>
          </Col>
        </Row>
      </Button>
    );
  };

  return (
    <>
      <div className="nameUser">
        <p style={{ fontSize: "14px" }}>ZoLa - {user?.name}</p>
      </div>
      <div className="tinNhan">
        <div className="conversations">
          <Row
            style={{ width: "100%", marginBottom: "5px" }}
            justify={"center"}
          >
            <Col span={19}>
              <Input
                size="middle"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearchChange}
                prefix={<SearchIcon style={{ fontSize: "20px" }} />}
              />
            </Col>
            <Col span={2}>
              <Button onClick={openModelAddFriend}>
                <PersonAddAltSharpIcon style={{ fontSize: "20px" }} />
              </Button>
            </Col>
            <Col span={2}>
              <Button onClick={openModelCreateGroup}>
                <GroupAddSharpIcon style={{ fontSize: "20px" }} />
              </Button>
            </Col>
          </Row>

          {filteredConversations?.map((item) => (
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
                <img
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
                        {formatTimeDifference(
                          new Date(item.lastMess.createdAt)
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="lastMess">
                  {chatReceived?.conversationId === item?.conversationId
                    ? chatReceived.senderId === currentUser?.uid
                      ? "Bạn: " + chatReceived.content.text
                      : item?.user?.name + ": " + chatReceived.content.text
                    : item.lastMess?.senderId === currentUser?.uid
                    ? "Bạn: " + item.lastMess?.content.text
                    : item?.user?.name + ": " + item.lastMess?.content.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        {children}
      </div>

      <Modal
        open={openModalAddFriend}
        title={<h3>Add friend</h3>}
        onCancel={() => setOpenModalAddFriend(false)}
        footer={null}
        width={"33%"}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #A9ACB0",
            paddingTop: "10px",
            maxHeight: "55vh",
            minHeight: "55vh",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <MuiTelInput
            size="small"
            defaultCountry={"VN"}
            value={number}
            onChange={setNumber}
            fullWidth
            id="phone"
            placeholder="Phone number"
            name="phone"
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              marginBottom: "10px",
              zIndex: 1,
            }}
          />
          <div
            style={{
              flexGrow: 1,
              overflow: "auto",
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {userFind !== undefined && (
              <div>
                <p>Find friend via phone number</p>
                <div>
                  {buttonAddFriend({
                    key: Date.now().toString(),
                    findGroup: false,
                    item: userFind,
                  })}
                </div>
              </div>
            )}
            {/* <div>
              <p>You may know</p>
              <div>
                {Array.from({ length: 1 }, (_, i) =>
                  buttonAddFriend({
                    key: i,
                    findGroup: true,
                    item: { name: "a" },
                  })
                )}
              </div>
            </div> */}
          </div>
          <Flex
            justify="end"
            gap={5}
            style={{
              borderTop: "1px solid #A9ACB0",
              marginTop: "10px",
              paddingTop: "5px",
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button
              key="back"
              onClick={() => setOpenModalAddFriend(false)}
              bgColor="#DFE2E7"
              bgColorHover="#C7CACF"
              color="black"
              padding="10px 25px"
            >
              CANCAL
            </Button>
            <Button
              key="submit"
              bgColor="#0068FF"
              bgColorHover="#0063F2"
              color="white"
              padding="10px 25px"
              // onClick={handleOK}
            >
              SEARCH
            </Button>
          </Flex>
        </div>
      </Modal>

      {/* Confirm add friend */}
      <ModalConfirmAddFriend
        show={openModalConfirmAddFriend}
        handleClose={() => setOpenModalConfirmAddFriend(false)}
        handleOK={() => setOpenModalConfirmAddFriend(false)}
        user={userFind}
      />
    </>
  );
};

export default Layout;
