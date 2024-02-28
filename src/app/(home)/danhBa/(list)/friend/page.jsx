"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import userApis from "@/apis/userApis";

const FriendPage = () => {
  // [
  //   {
  //     id: 1,
  //     image:
  //       "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
  //     name: "Lê Thanh Tùng",
  //   },
  //   {
  //     id: 2,
  //     image:
  //       "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_4_resize.jpg",
  //     name: "Huỳnh Khương Anh",
  //   },
  //   {
  //     id: 3,
  //     image:
  //       "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_6_resize.jpg",
  //     name: "Bá Zô Mà Núc",
  //   },
  // ]
  const [a, seta] = useState();
  const [friends, setFriends] = useState([]);

  // for (let i = 4; i <= 10; i++) {
  //   friends.push({
  //     id: i,
  //     image:
  //       "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_6_resize.jpg",
  //     name: `Bàn bè #${i}`,
  //   });
  // }

  useEffect(() => {
    const fetchdata = async () => {
      const users = await userApis.getAllUsers();
      console.log(users);
      setFriends(users);
      // return users;
    };
    fetchdata();
    // setFriends(fetchdata());
  }, []);

  const hanldeSelected = (id) => {
    seta(id);
  };

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
            <div key={item._id} className="itemF">
              <img
                className="avatar-img"
                src={item.image}
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
