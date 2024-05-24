import React from "react";
import { Modal } from "antd";
const ModalVideoCall = () => {
  return (
    <Modal
      title="Video call"
      style={{ height: "80%", width: "40%" }}
      open={true}
    >
      <div>Video call contentt</div>
    </Modal>
  );
};

export default ModalVideoCall;
