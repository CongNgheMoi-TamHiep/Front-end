import React from "react";
import { Modal, Row, Col } from "antd";

const ModalConfirmAddFriend = (props) => {
  const {
    children,
    show = true,
    handleClose,
    handleOK,
    footer = "null",
    user,
  } = props;
  return (
    <Modal
      open={show}
      title="Confirm"
      onCancel={handleClose}
      onOk={handleOK}
      footer={null}
      width={"35%"}
      // height={"100vh"}
    >
      <div
        style={{
          height: "70vh",
          // maxHeight: "500px",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          backgroundColor: "gray",
        }}
      >
        <Row>
          <Col flex="60px">
            <img
              className="avatar-img"
              src={
                "https://images.pexels.com/photos/6534399/pexels-photo-6534399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                //   user.img
              }
              alt=""
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
            />
          </Col>
          <Col flex={"auto"}>
            <h3>
              {/* {user.name} */}
              Name Test
            </h3>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ModalConfirmAddFriend;
