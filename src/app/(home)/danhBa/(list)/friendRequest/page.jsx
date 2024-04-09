"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Image from "next/image";

const FriendRequestPage = () => {
  const items = [
    {
      id: 1,
      name: "Lê Thanh Tùng",
      image:
        "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
    },
    {
      id: 2,
      name: "Lê Hữu Hiệp",
      image:
        "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
    },
    {
      id: 3,
      name: "Nguyễn Khánh An",
      image:
        "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
    },
    {
      id: 4,
      name: "Lò Văn Tủn",
      image:
        "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
    },
  ];

  return (
    <div className="containerFR">
      {items.map((item, index) => (
        <div className="itemFR" key={index}>
          <div className="topItemFR">
            <img className="imageFR" src={item.image} alt="" />
            <p className="nameFR">{item.name}</p>
          </div>
          <div className="bottomItemFR">
            <span>Xin chào, mình là {item.name}. Kết bạn cùng mình nhé!</span>
          </div>
          <div className="buttonItemFR">
            <button className="btn declineFR">Decline</button>
            <button className="btn acceptFR">Accept</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestPage;
