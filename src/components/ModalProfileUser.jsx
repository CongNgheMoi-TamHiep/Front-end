import React, { useState, useEffect } from "react";
import { Modal, Typography, Image } from "antd";
import { format } from "date-fns";

const ModalProfileUser = ({ isOpen, onClose, user }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsVisible(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={"33.3333%"}
      style={{
        top: 20,
        right: 0,
        position: "fixed",
        animation: isOpen
          ? "modal-slide-right 0.1s forwards"
          : "modal-slide-right-close 0.3s forwards",
      }}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      onAnimationEnd={handleAnimationEnd}
    >
      <style>
        {`
          @keyframes modal-slide-right {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          @keyframes modal-slide-right-close {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(100%);
            }
          }
        `}
      </style>
      <div style={{ height: "100%", overflowY: "auto" }}>
        <Typography.Title level={4}>Cá nhân</Typography.Title>
        <img
          src="https://cdn2.cellphones.com.vn/1200x400/https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/zalo-video-thumbnail.jpg"
          alt=""
          width={"100%"}
          height={"170px"}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginLeft: "10px",
            marginTop: "-20px",
            marginBottom: "10px",
          }}
        >
          <Image
            src={user.avatar}
            alt={user.name}
            width={60}
            height={60}
            style={{ borderRadius: "50%" }}
          />
          <Typography.Title
            level={4}
            style={{ fontSize: "20px", marginTop: "14px" }}
          >
            {user.name}
          </Typography.Title>
        </div>
        <div
          style={{
            paddingBottom: "10px",
            borderBottom: "3px solid #ccc",
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography.Title level={5}>Thông tin cá nhân</Typography.Title>

          <Typography.Text style={{ fontSize: "16px" }}>
            Giới tính: <span style={{ marginLeft: "39px" }}>{user.gender}</span>
          </Typography.Text>
          <Typography.Text style={{ fontSize: "16px" }}>
            Ngày sinh:{" "}
            <span style={{ marginLeft: "30px" }}>
              {user.dateOfBirth
                ? format(new Date(user.dateOfBirth), "dd/MM/yyyy")
                : "Chưa có thông tin"}
            </span>
          </Typography.Text>
          <Typography.Text style={{ fontSize: "16px" }}>
            Số điện thoại:{" "}
            <span style={{ marginLeft: "6px" }}>{user.number}</span>
          </Typography.Text>
        </div>
        <div
          style={{
            paddingBottom: "10px",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
          <Typography.Title level={5}>Ảnh</Typography.Title>
          <Typography.Text style={{ fontSize: "16px" }}>
            Không có hình ảnh
          </Typography.Text>
        </div>
      </div>
    </Modal>
  );
};

export default ModalProfileUser;
