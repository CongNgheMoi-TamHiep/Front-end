"use client";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import userApis from "@/apis/userApis";
import Image from "next/image";
import { AuthContext } from "@/context/AuthProvider";
import { useRouter } from 'next/navigation'
import CombineUserId from '@/utils/CombineUserId';
import ConversationApi from '@/apis/ConversationApi';

const FriendPage = () => {
  const [a, seta] = useState();
  const [friends, setFriends] = useState([]);
  const currentUser = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    const fetchdata = async () => {
      const users = await userApis.getAllUsers();
      setFriends(users.filter((user) => user._id !== currentUser?.uid));
      // return users;
    };
    fetchdata();
    // setFriends(fetchdata());
  }, [currentUser?.uid]);

  const hanldeSelected = (id) => {
    seta(id);
  };

  const handleDirectToConversation = async (userId) => {

    const conversation = await ConversationApi.getConversationById(CombineUserId(currentUser.uid, userId)); 
    if(conversation?._id) 
      router.push(`/tinNhan/${conversation._id}`);
    else
      router.push(`/tinNhan/${userId}`);
  }
  return (
    <div className="friend">
      <h3>Bạn bè ({friends.length})</h3>
      <div className="contentF">
        <div className="timLoc">
          <div className="timKiem">
            <SearchIcon sx={{ color: "#858585" }} />
            <input type="text" placeholder="Tìm kiếm bạn bè" />
          </div>
          <div className="loc">
            <div className="selectLoc">
              <SwapVertIcon />
              <select name="locTen" id="locTen">
                <option value="0">Tên (A - Z)</option>
                <option value="1">Tên (Z - A)</option>
              </select>
            </div>
            <div className="selectLoc">
              <FilterAltOutlinedIcon />
              <select name="locType" id="locType">
                <option value="0">Tất cả</option>
                <option value="1">Phân loại</option>
              </select>
            </div>
          </div>
        </div>

        <div className="listF">
          {friends.map((item) => (
            <div key={item._id} className="itemF" onClick={()=>handleDirectToConversation(item._id)}>
              <Image
                className="avatar-img"
                src={item.avatar}
                alt=""
                width={50}
                height={50}
              />
              <h4 className="nameF">{item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
