import React from "react";
import { Modal } from "antd";
export default function ModalVideoCall() {
  return (
    <Modal
      title="Video call"
      style={{ height: "80%", width: "40%" }}
      open={true}
    >
      <div>Video call content</div>
    </Modal>
  );
}
