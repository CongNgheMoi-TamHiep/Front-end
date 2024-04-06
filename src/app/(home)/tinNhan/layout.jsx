"use client";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import userApis from "@/apis/userApis";
import UserConversationApi from "@/apis/userConversationApi";
import { AuthContext } from "@/context/AuthProvider";
import { SocketContext } from "@/context/SocketProvider";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddSharpIcon from "@mui/icons-material/GroupAddSharp";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import { Col, Input, Row, Space, Modal, Divider } from "antd";
import { MuiTelInput } from "mui-tel-input";
import ModalConfirmAddFriend from "@/components/ModalConfirmAddFriend";

const Layout = ({ children }) => {
  const router = useRouter();
  const currentUser = React.useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [chatReceived, setChatReceived] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [userFind, setUserFind] = useState(null);
  const [number, setNumber] = useState("");
  const [openModalCreateGroup, setOpenModalCreateGroup] = useState(false);
  const [openModalAddFriend, setOpenModalAddFriend] = useState(false);
  const [openModalConfirmAddFriend, setOpenModalConfirmAddFriend] =
    useState(false);
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

  // useEffect(async () => {
  //   if (currentUser) {
  //     // setIsAuthenticated(true);
  //     const user1 = await userApis.getUserById(currentUser.uid);
  //     console.log(user1);
  //     setUser(user1);
  //   }
  // }, [currentUser]);

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

  const buttonAddFriend = ({ key, findGroup }) => {
    return (
      <Button
        width="100%"
        key={key}
        onClick={() => {
          setOpenModalConfirmAddFriend(true);
          // setUserFind()
        }}
      >
        <Row justify={"space-around"} gutter={16} style={{ width: "100%" }}>
          <Col flex={"60px"}>
            <img
              className="avatar-img"
              src={
                "https://images.pexels.com/photos/6534399/pexels-photo-6534399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
            <h4>Nguyen Van A</h4>
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
            >
              Add friend
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
            maxHeight: "50vh",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <MuiTelInput
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
              marginBottom: "5px",
              zIndex: 1,
            }}
          />
          {true && (
            <div>
              <p>Find friend via phone number</p>
              <div>
                {Array.from({ length: 1 }, (_, i) =>
                  buttonAddFriend({ key: i, findGroup: false })
                )}
              </div>
            </div>
          )}
          <div>
            <p>You may know</p>
            <div>
              {Array.from({ length: 4 }, (_, i) =>
                buttonAddFriend({ key: i, findGroup: true })
              )}
            </div>
          </div>
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
