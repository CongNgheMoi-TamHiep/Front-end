"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import ChatIcon from "@mui/icons-material/Chat";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import ContactsIcon from "@mui/icons-material/Contacts";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import { auth } from "@/firebase";
import axios from "axios";
import axiosPrivate from "@/apis/axios";
import { SocketContext } from "@/context/SocketProvider";
import userApis from "@/apis/userApis";
import { useSocket } from "../../context/SocketProvider";
import openNotificationWithIcon from "@/components/OpenNotificationWithIcon";
import ModalSettings from "@/components/ModalSettings";
import { useTranslation } from "react-i18next";
import ModalVideoCall from "@/components/ModalVideoCall";
import { Button, Flex, Image, Modal } from "antd";
import imageDefault from "constants/imgDefault";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
// import ReactAudioPlayer from "react-audio-player";
// import useSound from "use-sound";

const Layout = ({ children, params }) => {
  const { t } = useTranslation();
  const [Active, setActive] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentUser = useContext(AuthContext);
  const { socket } = useSocket();
  const [user, setUser] = useState(null);
  const [visibleSettingModal, setVisibleSettingModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [dataReviverCall, setDataReviverCall] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const audioRef = useRef();

  const handleCaNhanUser = () => {
    // console.log(item.currentUser?.uid);
    router.push("/caNhanUser");
  };
  const handleTinNhan = () => {
    setActive("tinNhan");
  };
  const handleDanhBa = () => {
    setActive("danhBa");
  };
  const handleSetting = () => {
    setVisibleSettingModal(true);
  };
  const handleCancelSettingModal = () => {
    setVisibleSettingModal(false);
  };
  const handleSignOut = () => {
    auth.signOut();
    router.push("/login");
    socket.disconnect();
  };

  useEffect(() => {
    (async () => {
      if (currentUser) {
        setIsAuthenticated(true);
        const user1 = await userApis.getUserById(currentUser.uid);
        setUser(user1);
      } else setIsAuthenticated(false);
      setIsLoading(false);
    })();
  }, [currentUser]);

  useEffect(() => {
    if (!isAuthenticated) return router.push("/login");
    else if (Active) router.push(`/${Active}`);
  }, [Active, isAuthenticated]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveFriendRequest", (data) => {
        console.log("Socket connected received", data);
        openNotificationWithIcon(
          "success",
          t("notification"),
          `${data.name} ${t("friend_request_notification")}`
        );
      });
      socket.on("acceptFriendRequest", (data) => {
        console.log("Socket connected accept", data);
        openNotificationWithIcon(
          "success",
          t("notification"),
          `${data.name} ${t("accept_friend_request_notification")}`
        );
      });

      socket.on("receive-call", async (data) => {
        if (data.caller != currentUser.uid) {
          userApis.getUserById(data.caller).then((res) => {
            console.log("res: ", res);
            setDataReviverCall(res);
          });
          audioRef.current.play();
          setOpenModal(true);
          console.log(data);
          setConversationId(data.channel);
        }
      });
      socket.on("end-call", (data) => {
        console.log("channel", data, conversationId);
        if (data.channel == conversationId) {
          setOpenModal(false);
          audioRef.current.pause();
        }
      });
    }
  }, [socket]);

  if (isLoading) return <Loading />;
  return (
    <div className="container">
      <div className="sidebar">
        <div className="top">
          <img
            className="avatar"
            width={48}
            height={48}
            alt=""
            src={
              user?.avatar ||
              "https://firebasestorage.googleapis.com/v0/b/zalo-78227.appspot.com/o/avatarDefault.jpg?alt=media&token=2b2922bb-ada3-4000-b5f7-6d97ff87becd"
            }
            onClick={handleCaNhanUser}
          />
          <div
            className={`item ${Active === "tinNhan" && "active"}`}
            onClick={handleTinNhan}
          >
            {Active === "tinNhan" ? (
              <ChatIcon sx={{ color: "#fff" }} />
            ) : (
              <ChatOutlined sx={{ color: "#fff" }} />
            )}
            <div className="badge">2</div>
          </div>
          <div
            className={`item ${Active === "danhBa" && "active"}`}
            onClick={handleDanhBa}
          >
            {Active === "danhBa" ? (
              <ContactsIcon sx={{ color: "#fff" }} />
            ) : (
              <ContactsOutlined sx={{ color: "#fff" }} />
            )}
          </div>
          <div
            className={`item ${Active === "settings" && "active"}`}
            onClick={handleSetting}
          >
            <SettingsOutlined sx={{ color: "#fff" }} />
          </div>
          <ModalSettings
            visible={visibleSettingModal}
            onClose={handleCancelSettingModal}
          />
        </div>
        <div className="bottom">
          <div className="item" onClick={handleSignOut}>
            <LogoutIcon sx={{ color: "#fff", fontSize: 30 }} />
          </div>
        </div>
      </div>
      <div style={{ height: "100vh" }}>{children}</div>
      <Modal
        title={null}
        styles={{
          backgroundColor: "#1677FF",
          position: "relative",
        }}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        closable={false}
        width={40}
      >
        <Flex
          style={{
            backgroundColor: "#1677FF",
            height: "400px",
            width: "300px",
            top: "0",
            left: "-130px",
            position: "absolute",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.9)",
          }}
          justify="space-around"
          align="center"
          vertical
        >
          <Image
            src={dataReviverCall?.avatar || imageDefault}
            preview={false}
            width={120}
            height={120}
            style={{ borderRadius: "50%" }}
          />
          <h3>{dataReviverCall?.name || "Tên ở đây"}</h3>
          <Flex gap={30}>
            <Button
              icon={<CallEndIcon fontSize="large" sx={{ color: "white" }} />}
              style={{
                backgroundColor: "red",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                border: "none",
              }}
              onClick={() => {
                audioRef.current.pause();
                setOpenModal(false);
                socket.emit("decline-call", { channel: conversationId });
              }}
            />
            <Button
              icon={<VideocamIcon fontSize="large" sx={{ color: "white" }} />}
              style={{
                backgroundColor: "green",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                border: "none",
              }}
              onClick={() => {
                setOpenModal(false);
                audioRef.current.pause();
                // audioRef.current.play();
                router.push(`/VideoCall/${conversationId}`);
              }}
            />
          </Flex>
        </Flex>
      </Modal>
      <audio ref={audioRef} src="/soundAB.mp3"></audio>
    </div>
  );
};

export default Layout;
