"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Image from "next/image";

const GroupPage = () => {
  const [a, seta] = useState();
  const [groups, setGroups] = useState([
    {
      id: 21,
      image:
        "https://designs.vn/wp-content/images/06-08-2013/logo_lagi_2_resize.jpg",
      name: "Nhóm CMN",
    },
    {
      id: 22,
      image:
        "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_4_resize.jpg",
      name: "Nhóm KT",
    },
    {
      id: 23,
      image:
        "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_6_resize.jpg",
      name: "Nhóm của tôi",
    },
  ]);

  // for (let i = 24; i <= 30; i++) {
  //   groups.push({
  //     id: i,
  //     image:
  //       "https://designs.vn/wp-content/images/09-08-2013/logo_lagi_6_resize.jpg",
  //     name: `Nhóm #${i}`,
  //   });
  // };

  const hanldeSelected = (id) => {
    seta(id);
  };

  return (
    <div className="friend">
      <h3> Nhóm ({groups.length})</h3>
      <div className="contentF">
        <div className="timLoc">
          <div className="timKiem">
            <SearchIcon sx={{ color: "#858585" }} />
            <input type="text" placeholder="Tìm kiếm bạn bè" />
          </div>
          <div className="loc">
            <div className="selectLoc" tabIndex="0">
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
          {groups.map((item) => (
            <div key={item.id} className="itemF">
              <Image
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

export default GroupPage;
