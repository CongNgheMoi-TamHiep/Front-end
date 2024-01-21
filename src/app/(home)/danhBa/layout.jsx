"use client";
import React, { useState } from "react";
import "./styles.scss";
import DraftsIcon from "@mui/icons-material/Drafts";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const items = [
    { id: 1, title: "Danh sách bạn bè", icon: <PersonIcon className="icon" /> },
    { id: 2, title: "Danh sách nhóm", icon: <GroupIcon className="icon" /> },
    { id: 3, title: "Lời mời kết bạn", icon: <DraftsIcon className="icon" /> },
  ];

  const router = useRouter();
  const [active, setActive] = useState(1);
  const [selected, setSelected] = useState(items[0]);
  const [urlPage, setUrlPage] = useState("/danhBa/friend");

  const changePageChildren = (active) => {
    switch (active) {
      case 1:
        return "/danhBa/friend";
      case 2:
        return "/danhBa/group";
      case 3:
        return "/danhBa/friend";
    }
  };

  const handleSelectMenu = (item) => {
    setSelected(item);
    setActive(item.id);
  };

  router.push(changePageChildren(active));

  return (
    <div className="danhBa">
      <div className="itemL">
        <div className="search">Search</div>
        <div className="items">
          {items.map((item) => (
            <div
              className={`item ${active == item.id && "active"}`}
              key={item.id}
              onClick={() => handleSelectMenu(item)}
            >
              {item.icon} {item.title}
            </div>
          ))}
        </div>
      </div>
      <div className="itemR">
        <div className="title">
          {selected.icon} {selected.title}
        </div>
        <div className="children">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
