"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Image from "next/image";

const FriendRequestPage = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(0); // 0: A-Z, 1: Z-A

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(parseInt(event.target.value));
  };

  const sortedGroups = groups.sort((a, b) => {
    if (sortOrder === 0) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const filteredGroups = sortedGroups.filter((group) => {
    const searchValue = searchTerm.toLowerCase();
    return group.name.toLowerCase().includes(searchValue);
  });

  const items = [
    { id: 1, title: "Friend Lists" },
    { id: 2, title: "Joined Groups" },
    { id: 3, title: "Friend Requests" },
    { id: 4, title: "Friend Lists" },
    { id: 5, title: "Joined Groups" },
    { id: 6, title: "Friend Requests" },
  ];

  return (
    // <div className="friend">
    //   <h3>Nhóm ({filteredGroups.length})</h3>
    //   <div className="contentF">
    //     <div className="timLoc">
    //       <div className="timKiem">
    //         <SearchIcon sx={{ color: "#858585" }} />
    //         <input
    //           type="text"
    //           placeholder="Tìm kiếm nhóm"
    //           value={searchTerm}
    //           onChange={handleSearchChange}
    //         />
    //       </div>
    //       <div className="loc">
    //         <div className="selectLoc" tabIndex="0">
    //           <SwapVertIcon />
    //           <select
    //             name="locTen"
    //             id="locTen"
    //             onChange={handleSortChange}
    //             value={sortOrder}
    //           >
    //             <option value={0}>Tên (A - Z)</option>
    //             <option value={1}>Tên (Z - A)</option>
    //           </select>
    //         </div>
    //         <div className="selectLoc">
    //           <FilterAltOutlinedIcon />
    //           <select name="locType" id="locType">
    //             <option value={0}>Tất cả</option>
    //             <option value={1}>Phân loại</option>
    //           </select>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="listF">
    //       {filteredGroups.map((item) => (
    //         <div key={item.id} className="itemF">
    //           <img
    //             className="avatar-img"
    //             src={item.image}
    //             alt=""
    //             width={50}
    //             height={50}
    //           />
    //           <h4 className="nameF">{item.name}</h4>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="containerFR">
      {items.map((item, index) => (
        <div className="itemFR" key={index}>
          {item.title}
        </div>
      ))}
      <div className="view-moreFR">
        <button>View More</button>
      </div>
    </div>
  );
};

export default FriendRequestPage;
