"use client";
import React, { useContext, useEffect, useState } from "react";

import AgoraUIKit from "agora-react-uikit";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import { useSocket } from "context/SocketProvider";
// import { useSocket } from "../../context/SocketProvider";

const Page = (conversationId) => {
  const [videoCall, setVideoCall] = useState(false);
  const router = useRouter();
  const currentUser = useContext(AuthContext);
  const { socket } = useSocket();

  useEffect(() => {
    setVideoCall(true);
  }, [conversationId]);

  useEffect(() => {
    if (socket) {
    socket.on("decline-call", (data) => {
      console.log("channel", data);
      if (data.channel === conversationId.params.id) {
        setVideoCall(false);
        window.location.href = `${window.location.origin}/tinNhan/${conversationId.params.id}`;
      }
    });

    socket.on("end-call", (data) => {
      console.log("data", data?.channel);
      if (data?.channel == conversationId.params.id) {
        setVideoCall(false);
        window.location.href = `${window.location.origin}/tinNhan/${conversationId.params.id}`;
      }
    });

    console.log("socket", socket);
    }
  }, [socket]);

  const rtcProps = {
    appId: "5a55004d2d524938a0edde0ecd2349ae",
    channel: conversationId.params.id,
  };

  const callbacks = {
    EndCall: () => {
      socket.emit("end-call", {
        channel: conversationId.params.id,
      });
      setVideoCall(false);
      window.location.href = `${window.location.origin}/tinNhan/${conversationId.params.id}`;
      // window.location.reload();
    },
  };

  return (
    <div className="App">
      {videoCall && (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      )}
    </div>
  );
};

export default Page;
