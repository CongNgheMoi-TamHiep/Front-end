import React from "react";
import "./styles.scss";

const DanhBa = () => {
  const quantity = 88
  return (
    <div className="friend">  
      <h3>Bạn bè ({quantity})</h3>
      <div className="contentF">
        <div className="timLoc">
          <div className="timKiem">
            <input type="text" placeholder="Tìm kiếm bạn bè" />
          </div>
          <div className="loc">
            <select name="locTen" id="locTen">
              <option value="0">Tên (A - Z)</option>
              <option value="1">Tên (Z - A)</option>
            </select>
            <select name="locType" id="locType">
              <option value="0">Tất cả</option>
              <option value="1">Phân loại</option>
            </select>
          </div>
        </div>

        <div className="listF">
            
        </div>
      </div>
    </div>
  );
};

export default DanhBa;
