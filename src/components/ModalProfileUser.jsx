import { Box, Button, Modal, Typography } from "@mui/material";
import "../app/(home)/caNhanUser/modalInfo/style.scss";
import React from "react";
import { format } from "date-fns";

const ModalProfileUser = ({ isOpen, onClose, user }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0)", // Màu của lớp phủ
        },
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          right: "0",
          transform: "translateY(-50%)",
          width: "33.3333%",
          height: "97%",
          bgcolor: "background.paper",
          border: "1px solid #ccc",
          mt: "10px",
          borderRadius: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "bold",
            mt: "6px",
            ml: "10px",
            mb: "6px",
          }}
        >
          Cá nhân
        </Typography>
        <img
          src="https://cdn2.cellphones.com.vn/1200x400/https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/zalo-video-thumbnail.jpg"
          alt=""
          width={"100%"}
          height={"170px"}
        />

        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            mt: "-16px",
            ml: "20px",
          }}
        >
          <Typography>
            <img
              src={user.avatar}
              alt={user.name}
              width={60}
              height={60}
              style={{ borderRadius: "50%" }}
            />
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ fontSize: "18px", fontWeight: "bold" }}
          >
            {user.name}
          </Typography>
        </Box>
        <Box sx={{ pb: "10px", borderBottom: "3px solid #ccc", ml: "10px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
              mt: "6px",
              ml: "10px",
              mb: "10px",
            }}
          >
            Thông tin cá nhân
          </Typography>
          <Typography sx={{ fontSize: "16px", ml: "10px", mt: "6px" }}>
            Giới tính: <span style={{ marginLeft: "39px" }}>{user.gender}</span>
          </Typography>
          <Typography sx={{ fontSize: "16px", ml: "10px", mt: "6px" }}>
            Ngày sinh:{" "}
            <span style={{ marginLeft: "30px" }}>
              {user.dateOfBirth
                ? format(new Date(user.dateOfBirth), "dd/MM/yyyy")
                : "Chưa có thông tin"}
            </span>
          </Typography>
          <Typography sx={{ fontSize: "16px", ml: "10px", mt: "6px" }}>
            Số điện thoại:{" "}
            <span style={{ marginLeft: "6px" }}>{user.number}</span>
          </Typography>
        </Box>
        <Box
          sx={{
            pb: "10px",
            // borderBottom: "3px solid #ccc",
            ml: "10px",
            mt: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
              mt: "6px",
              ml: "10px",
              mb: "10px",
            }}
          >
            Ảnh
          </Typography>
          <Typography sx={{ fontSize: "16px", ml: "10px", mt: "6px" }}>
            Không có hình ảnh
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};
export default ModalProfileUser;
