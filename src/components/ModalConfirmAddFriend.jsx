import React from "react";
import { Modal, Row, Col, Input, Flex, Image } from "antd";
import Button from "@/components/Button";

const ModalConfirmAddFriend = (props) => {
  const { TextArea } = Input;
  const {
    children,
    message,
    setMessage,
    height = "50vh",
    show = true,
    handleClose,
    handleOK,
    user,
  } = props;

  return (
    <Modal
      open={show}
      title={<h3>Confirm</h3>}
      onCancel={handleClose}
      onOk={handleOK}
      footer={null}
      width={"33%"}
    >
      <Flex
        vertical
        justify="center"
        gap="15px"
        style={{
          height: height,
          maxHeight: height,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Flex justify="start" align="center" gap={20}>
          <Col flex="80px">
            <Image
              className="avatar-img"
              src={
                "https://images.pexels.com/photos/6534399/pexels-photo-6534399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                //   user.img
              }
              alt=""
              width={80}
              height={80}
              style={{ borderRadius: "50%" }}
            />
          </Col>
          <Col flex={"auto"}>
            <h3>
              {/* {user.name} */}
              Name Test
            </h3>
          </Col>
        </Flex>
        <TextArea
          showCount
          maxLength={100}
          onChange={setMessage}
          value={message}
          placeholder="Enter your message here..."
          style={{
            height: 120,
            resize: "none",
          }}
        />
        <Flex
          justify="end"
          gap={10}
          style={{
            borderTop: "1px solid #A9ACB0",
            marginTop: "14px",
            paddingTop: "10px",
          }}
        >
          <Button
            key="back"
            onClick={handleClose}
            bgColor="#DFE2E7"
            bgColorHover="#C7CACF"
            color="black"
            padding="10px 25px"
          >
            CANCAL
          </Button>
          <Button
            key="submit"
            bgColor="#0068FF"
            bgColorHover="#0063F2"
            color="white"
            padding="10px 25px"
            onClick={handleOK}
          >
            ADD FRIEND
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default ModalConfirmAddFriend;
