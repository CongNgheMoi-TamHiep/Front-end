import React from "react";

const ModalInfo = ({
  show,
  handleClose,
  newName,
  setNewName,
  newGender,
  setNewGender,
  newDateOfBirth,
  setNewDateOfBirth,
  handleUpdateUserInfo,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={handleClose}>
          &times;
        </span>
        <h2>Thông tin cá nhân</h2>
        <div className="form-group">
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Giới tính:</label>
          <select
            id="gender"
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
          >
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Ngày sinh:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={newDateOfBirth}
            onChange={(e) => setNewDateOfBirth(e.target.value)}
          />
        </div>
        <button onClick={handleUpdateUserInfo}>Submit</button>
      </div>
    </div>
  );
};

export default ModalInfo;
