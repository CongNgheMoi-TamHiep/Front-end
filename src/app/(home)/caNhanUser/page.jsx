"use client";
import userApis from "@/apis/userApis";
import Loading from "@/components/Loading";
import { AuthContext } from "@/context/AuthProvider";
import React, { useContext, useEffect, useState } from "react";

const page = () => {
  const currentUser = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await userApis.getUserById(currentUser?.uid);
        setUserId(user);
        // console.log(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchData();
    // currentUser?.uid
  }, [currentUser?.uid]);

  return (
    <div className="conversationChat" style={{ flex: 5 }}>
      <img
        src="https://cdn2.cellphones.com.vn/1200x400/https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/zalo-video-thumbnail.jpg"
        alt=""
        width={"100%"}
        height={"200px"}
      />
      <div style={{ marginTop: "10px", marginLeft: "40px" }}>
        {userId ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img
              src={userId.avatar}
              width={80}
              height={80}
              style={{ borderRadius: "50%" }}
              alt=""
            />

            <p style={{ fontSize: "20px" }}>{userId.name}</p>
          </div>
        ) : (
          <p>
            <Loading />
          </p>
        )}
      </div>
      <div style={{ marginTop: "25px" }}>
        {userId ? (
          <div
            style={{
              justifyContent: "flex-start",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginLeft: "40px",
            }}
          >
            <h3>Thông tin cá nhân</h3>
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <p>Giới tính: </p>
              <p>{userId.gender ? userId.gender : "Chưa có thông tin"}</p>
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <p>Ngày sinh: </p>
              <p>{userId.birthday ? userId.birthday : "Chưa có thông tin"}</p>
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <p>Điện thoại: </p>
              <p>{userId.number ? userId.number : "Chưa có thông tin"}</p>
            </div>
          </div>
        ) : (
          <p>
            <Loading />
          </p>
        )}
      </div>
    </div>
  );
};

export default page;
