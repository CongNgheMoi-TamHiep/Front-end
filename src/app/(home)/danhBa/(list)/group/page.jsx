"use client";
import React, { useState } from "react";
import "./styles.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useTranslation } from "react-i18next";

const GroupPage = () => {
  const { t } = useTranslation();
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

  return (
    <div className="friend">
      <h3>
        {t("Groups")} ({filteredGroups.length})
      </h3>
      <div className="contentF">
        <div className="timLoc">
          <div className="timKiem">
            <SearchIcon sx={{ color: "#858585" }} />
            <input
              type="text"
              placeholder={t("Search groups")}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="loc">
            <div className="selectLoc" tabIndex="0">
              <SwapVertIcon />
              <select
                name="locTen"
                id="locTen"
                onChange={handleSortChange}
                value={sortOrder}
              >
                <option value={0}>{t("Name (A - Z)")}</option>
                <option value={1}>{t("Name (Z - A)")}</option>
              </select>
            </div>
            <div className="selectLoc">
              <FilterAltOutlinedIcon />
              <select name="locType" id="locType">
                <option value={0}>{t("All")}</option>
                <option value={1}>{t("Categorized")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="listF">
          {filteredGroups.map((item) => (
            <div key={item.id} className="itemF">
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

export default GroupPage;
