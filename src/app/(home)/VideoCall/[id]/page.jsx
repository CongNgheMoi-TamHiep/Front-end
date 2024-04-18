"use client";
import React, { useEffect, useState } from "react";

import AgoraUIKit from "agora-react-uikit";
import { useRouter } from "next/navigation";

const Page = (conversationId) => {
  const [videoCall, setVideoCall] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setVideoCall(true);
  }, [conversationId]);

  const rtcProps = {
    appId: "5a55004d2d524938a0edde0ecd2349ae",
    channel: conversationId.params.id,
  };
  // console.log(conversationId.params.id);

  const callbacks = {
    EndCall: () => {
      setVideoCall(false);
      router.push("/tinNhan");
    },
  };

  return (
    <div className="App">
      {videoCall ? (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      ) : null}
    </div>
  );
};

export default Page;


