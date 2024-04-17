/* eslint-disable react/jsx-key */
import { Modal, Button, Input, List, Switch, Select, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import Group from "@/apis/Group";
import { useRouter } from "next/navigation";
const ModalSettingGroup = ({ visible, onCancel, conversationId }) => {
  const router = useRouter();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [disbandModalVisible, setDisbandModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [members, setMembers] = useState([
    "member1@gmail.com",
    "member2@gmail.com",
    "member3@gmail.com",
  ]);
  const [pendingMembers, setPendingMembers] = useState([
    "newmember@example.com",
  ]);
  const [transferOwnershipModalVisible, setTransferOwnershipModalVisible] =
    useState(false);
  const handleTransferOwnership = (selectedMember) => {
    console.log("Transfer ownership to:", selectedMember);
  };

  const handleAddMember = (member) => {
    setMembers((prevMembers) => [...prevMembers, member]);
  };

  const handleRemoveMember = (member) => {
    setMembers((prevMembers) => prevMembers.filter((m) => m !== member));
  };

  const handleApproveMember = (member) => {
    setPendingMembers((prevPendingMembers) =>
      prevPendingMembers.filter((m) => m !== member)
    );
    setMembers((prevMembers) => [...prevMembers, member]);
  };

  const handleRejectMember = (member) => {
    setPendingMembers((prevPendingMembers) =>
      prevPendingMembers.filter((m) => m !== member)
    );
  };
  const EditGroupInfoModal = ({ visible, onCancel, onOk }) => {
    const [groupName, setGroupName] = useState("");

    const handleInputChange = (event) => {
      setGroupName(event.target.value);
    };

    // const handleInputChange = (event) => {
    //   const { name, value } = event.target;
    //   setGroupInfo((prevGroupInfo) => ({
    //     ...prevGroupInfo,
    //     [name]: value,
    //   }));
    // };

    const handleSaveSettings = async () => {
      try {
        await Group.update(conversationId, { name: groupName });
        window.location.reload();
        console.log("Group settings saved:", groupName);
        onOk();
      } catch (error) {
        console.error("Error updating group info:", error);
      }
    };

    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Đóng
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveSettings}>
            Lưu
          </Button>,
        ]}
        title="Sửa thông tin nhóm"
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "10%" }}>
          <Input
            value={groupName}
            onChange={handleInputChange}
            placeholder="Tên nhóm"
          />
        </div>
      </Modal>
    );
  };
  const MemberManagementModal = ({
    visible,
    onCancel,
    conversationId,
    onAddMember,
    onRemoveMember,
    onApproveMember,
    onRejectMember,
  }) => {
    const [newMemberName, setNewMemberName] = useState("");
    const [members, setMembers] = useState([]);
    const [pendingMembers, setPendingMembers] = useState([]);

    // const handleAddMember = async () => {
    //   if (newMemberName.trim() !== "") {
    //     try {
    //       await Group.addMember(conversationId, { userId: userId });
    //       setNewMemberName("");
    //       fetchMembers();
    //     } catch (error) {
    //       console.error("Error adding member:", error);
    //     }
    //   }
    // };

    useEffect(() => {
      const fetchMembers = async () => {
        try {
          const response = await Group.getMembers(conversationId);
          setMembers(response);
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      };

      if (visible) {
        fetchMembers();
      }
    }, [visible, conversationId]);

    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button key="add" type="primary" onClick={handleAddMember}>
            Thêm
          </Button>,
        ]}
        title="Quản lý thành viên"
      >
        <div>
          <Input
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Thành viên mới"
            style={{ marginBottom: "10px" }}
          />
          <h3>Thành viên đang chờ duyệt:</h3>
          <List
            dataSource={pendingMembers}
            renderItem={(member) => (
              <List.Item
                key={member._id}
                actions={[
                  <Button
                    onClick={() => onApproveMember(member)}
                    type="primary"
                  >
                    Duyệt
                  </Button>,
                  <Button onClick={() => onRejectMember(member)} danger>
                    Từ chối
                  </Button>,
                ]}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={member.avatar}
                    alt="Avatar"
                    style={{
                      marginRight: "20px",
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                    }}
                  />
                  {member.name}
                </div>
              </List.Item>
            )}
          />
          <h3>Thành viên:</h3>
          <List
            dataSource={members}
            renderItem={(member) => (
              <List.Item
                key={member._id}
                actions={[
                  <Button onClick={() => onRemoveMember(member)}>Xóa</Button>,
                ]}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={member.avatar}
                    alt="Avatar"
                    style={{
                      marginRight: "20px",
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ flexGrow: 1 }}>{member.name}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    );
  };
  const TransferOwnershipModal = ({
    visible,
    onCancel,
    members,
    onTransferOwnership,
    onSave,
  }) => {
    const [selectedMember, setSelectedMember] = useState(null);

    const handleTransferOwnership = () => {
      onTransferOwnership(selectedMember);
      setSelectedMember(null);
      onSave();
    };

    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={handleTransferOwnership}
        title="Chuyển quyền trưởng nhóm"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn thành viên"
          value={selectedMember}
          onChange={(value) => setSelectedMember(value)}
        >
          {members.map((member, index) => (
            <Select.Option key={index} value={member}>
              {member}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    );
  };

  const DisbandGroupModal = ({ visible, onCancel, onOk, conversationId }) => {
    const handleConfirmDisband = async () => {
      try {
        await Group.delete(conversationId);
        router.push("/tinNhan");
        console.log(conversationId);
        console.log("Group deleted successfully");
        onOk();
      } catch (error) {
        console.error("Error disbanding group:", error);
      }
    };

    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button key="confirm" type="danger" onClick={handleConfirmDisband}>
            Xác nhận
          </Button>,
        ]}
        title="Giải tán nhóm"
      >
        <p>Bạn có chắc chắn muốn giải tán nhóm?</p>
      </Modal>
    );
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="Cài đặt nhóm"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          {" "}
          <Button
            style={{ border: "none", padding: "0px", background: "#fff" }}
            onClick={() => setEditModalVisible(true)}
          >
            Sửa thông tin nhóm
          </Button>
        </div>

        <div>
          <Button
            style={{ border: "none", padding: "0px", background: "#fff" }}
            onClick={() => setMemberModalVisible(true)}
          >
            Quản lý thành viên
          </Button>
        </div>
        <div>
          <div>
            <Button
              style={{ border: "none", padding: "0px", background: "#fff" }}
              onClick={() => setTransferOwnershipModalVisible(true)}
            >
              Chuyển quyền trưởng nhóm
            </Button>
          </div>

          <TransferOwnershipModal
            visible={transferOwnershipModalVisible}
            onCancel={() => setTransferOwnershipModalVisible(false)}
            members={members}
            onTransferOwnership={handleTransferOwnership}
            onSave={() => setTransferOwnershipModalVisible(false)}
          />
        </div>

        <div style={{ marginTop: "6px" }}>
          <span style={{ marginRight: "55px" }}>Duyệt Thành Viên</span>
          <Switch
            checkedChildren=""
            unCheckedChildren=""
            // onClick={() => setMemberModalVisible(!memberModalVisible)}
          />
        </div>
        <div style={{ marginTop: "6px" }}>
          <span style={{ marginRight: "30px" }}>Quyền sửa thông tin </span>
          <Switch checkedChildren="" unCheckedChildren="" />
        </div>

        <div style={{ marginTop: "6px" }}>
          <span style={{ marginRight: "40px" }}>Quyền gửi tin nhắn </span>
          <Switch checkedChildren="" unCheckedChildren="" />
        </div>
        <div>
          <Button
            style={{ border: "none", padding: "0px", background: "#fff" }}
            onClick={() => setDisbandModalVisible(true)}
          >
            Giải tán nhóm
          </Button>
        </div>
      </div>
      <EditGroupInfoModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => setEditModalVisible(false)}
        conversationId={conversationId}
      />
      <MemberManagementModal
        visible={memberModalVisible}
        onCancel={() => setMemberModalVisible(false)}
        pendingMembers={pendingMembers}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onApproveMember={handleApproveMember}
        onRejectMember={handleRejectMember}
        conversationId={conversationId}
      />
      <DisbandGroupModal
        visible={disbandModalVisible}
        onCancel={() => setDisbandModalVisible(false)}
        onOk={() => setDisbandModalVisible(false)}
        conversationId={conversationId}
      />
    </Modal>
  );
};

export default ModalSettingGroup;
