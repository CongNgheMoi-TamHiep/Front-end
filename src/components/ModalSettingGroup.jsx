/* eslint-disable react/jsx-key */
import {
  Modal,
  Button,
  Input,
  List,
  Switch,
  Select,
  Checkbox,
  notification,
  Flex,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import Group from "@/apis/Group";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import FriendApi from "@/apis/FriendApi";
import openNotificationWithIcon from "./OpenNotificationWithIcon";
const ModalSettingGroup = ({ visible, onCancel, conversationId }) => {
  const router = useRouter();

  const currentUser = useContext(AuthContext);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [disbandModalVisible, setDisbandModalVisible] = useState(false);
  const [outGroupModalVisible, setOutGroupModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [roleCurrentUser, setRoleCurrentUser] = useState("");
  const [pendingMembers, setPendingMembers] = useState([
    "newmember@example.com",
  ]);
  const [transferOwnershipModalVisible, setTransferOwnershipModalVisible] =
    useState(false);
  const [addGroupDeputyModalVisible, setAddGroupDeputyModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await Group.getMembers(conversationId);
        response.some((member) => {
          if (
            (member.role === "admin" || member.role === "deputy") &&
            member._id === currentUser.uid
          ) {
            setRoleCurrentUser(member.role);
            return true;
          }
          return false;
        });
        setMembers(response);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    if (visible) {
      fetchMembers();
    }
  }, [visible, conversationId]);
  const handleTransferOwnership = async (selectedMember) => {
    try {
      await Group.transferAdmin(conversationId, { userId: selectedMember });
      // router.push(`/tinNhan/${conversationId}`);
      // window.location.reload();
      console.log("Transfer ownership to:", selectedMember);
    } catch (error) {
      console.error("Error transferring ownership:", error);
    }
  };
  const handleAddGroupDeputy = async (selectedMember) => {
    try {
      await Group.addDeputy(conversationId, { userId: selectedMember });
      // router.push(`/tinNhan/${conversationId}`);
      // console.log("Add deputy to:", selectedMember);
      notification.success({
        description: "Thêm phó nhóm thành công.",
      });
    } catch (error) {
      console.error("Error add deputy :", error);
      notification.error({
        description: "Thêm phó nhóm thất bại.",
      });
    }
  };
  const handleAddMember = (member) => {
    setMembers((prevMembers) => [...prevMembers, member]);
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
        // window.location.reload();
        console.log("Group settings saved:", groupName);
        onOk();
      } catch (error) {
        console.error("Error updating group info:", error);
      }
    };

    return (
      <Modal
        open={visible}
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
    onApproveMember,
    onRejectMember,
  }) => {
    const [newMemberName, setNewMemberName] = useState("");
    const [friendAdd, setFriendAdd] = useState([]);
    const [listSelectFriend, setListSelectFriend] = useState([]);
    const [members, setMembers] = useState([]);
    const [pendingMembers, setPendingMembers] = useState([]);
    const handleAddMember = async () => {
      console.log("listSelectFriend: ", listSelectFriend);

      if (listSelectFriend.length == 0) {
        openNotificationWithIcon("error", "Error", "Chưa chọn thành viên");
      } else {
        for (let i = 0; i < listSelectFriend.length; i++) {
          try {
            await Group.addMember(conversationId, {
              userId: listSelectFriend[i],
            });
          } catch (error) {
            console.error("Error adding member:", error);
            notification.error({
              message: "Error",
              description: "Thêm thành viên thất bại",
            });
            return;
          }
        }

        setMembers((prevMembers) => [...prevMembers, ...listSelectFriend]);
        notification.success({
          message: "Success",
          description: "Đã thêm thành viên thành cônggggg",
        });
      }
    };

    useEffect(() => {
      const fetchMembers = async () => {
        try {
          const response = await Group.getMembers(conversationId);
          response.some((member) => {
            if (
              (member.role === "admin" || member.role === "deputy") &&
              member._id === currentUser.uid
            ) {
              setRoleCurrentUser(member.role);
              return true;
            }
            return false;
          });
          setMembers(response);

          FriendApi.getFriends(currentUser.uid).then((res) => {
            setFriendAdd(
              res.filter(
                (item) => !response.map((i) => i._id).includes(item.userId)
              )
            );
          });

          Group.getGroup(conversationId).then((res) => {
            console.log("res", res);
            setPendingMembers(res.waitingList);
          });
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      };

      if (visible) {
        fetchMembers();
      }
    }, [visible, conversationId]);

    const handleRemoveMember = async (memberId) => {
      try {
        await Group.deleteMember(conversationId, memberId);
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member._id !== memberId)
        );
        console.log("Member removed successfully:", memberId);
        notification.success({
          message: "Success",
          description: "Đã xoá thành viên thành công.",
        });
      } catch (error) {
        console.error("Error removing member:", error);
        notification.error({
          message: "Error",
          description: "Xoá thành viên thất bại.",
        });
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
          <Button key="add" type="primary" onClick={handleAddMember}>
            Thêm
          </Button>,
        ]}
        title="Quản lý thành viên"
      >
        <div>
          <Select
            mode="tags"
            placeholder="Thành viên mới"
            // defaultValue={["a10", "c12"]}
            onChange={(value) => setListSelectFriend(value)}
            style={{
              width: "100%",
            }}
            options={friendAdd.map((item) => ({
              label: item.name,
              value: item.userId,
            }))}
          />
          {roleCurrentUser != "" && (
            //  && pendingMembers.length > 0
            <>
              <h3 style={{ marginTop: "5px" }}>Thành viên đang chờ duyệt:</h3>
              <div
                style={{
                  height: 200,
                  overflow: "auto",
                  padding: "0 16px",
                }}
                className="nonScroll"
              >
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
              </div>
            </>
          )}
          <h3 style={{ marginTop: "5px" }}>Thành viên:</h3>
          <div
            style={{
              height: 200,
              overflow: "auto",
              padding: "0 16px",
            }}
            className="nonScroll"
          >
            <List
              dataSource={members}
              renderItem={(member) => (
                <List.Item
                  key={member._id}
                  actions={[
                    <Button
                      style={{
                        display: roleCurrentUser === "" ? "none" : "block",
                      }}
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      Xóa
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
                    <Flex style={{ flexGrow: 1 }} vertical={true}>
                      <span style={{ fontSize: "16px", fontWeight: "500" }}>
                        {member.name}
                      </span>
                      <span style={{ color: "gray" }}>
                        {member.role === "admin"
                          ? "Quản trị viên"
                          : member.role === "member"
                          ? "Thành viên"
                          : "Phó nhóm"}
                      </span>
                    </Flex>
                  </div>
                </List.Item>
              )}
            />
          </div>
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
      setRoleCurrentUser("");
      onSave();
      setTransferOwnershipModalVisible(false);
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
          {members.map((member) => (
            <Select.Option key={member._id} value={member._id}>
              {member.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    );
  };
  const AddGroupDeputy = ({
    visible,
    onCancel,
    members,
    onAddGroupDeputy,
    onSave,
  }) => {
    const [selectedMember, setSelectedMember] = useState(null);

    const handleAddGroupDeputy = () => {
      onAddGroupDeputy(selectedMember);
      setSelectedMember(null);
      onSave();
    };

    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={handleAddGroupDeputy}
        title="Thêm phó nhóm"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn thành viên"
          value={selectedMember}
          onChange={(value) => setSelectedMember(value)}
        >
          {members.map((member) => (
            <Select.Option key={member._id} value={member._id}>
              {member.name}
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
        notification.error({
          message: "Lỗi",
          description: "Bạn không phải admin nên không thể giải tán nhóm.",
        });
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
          <Button
            style={{
              border: "1px solid #ccc",
              backgroundColor: "#f5222d",
            }}
            key="confirm"
            type="danger"
            onClick={handleConfirmDisband}
          >
            Xác nhận
          </Button>,
        ]}
        title="Giải tán nhóm"
      >
        <p>Bạn có chắc chắn muốn giải tán nhóm?</p>
      </Modal>
    );
  };
  const OutGroupModal = ({ visible, onCancel, onOk, conversationId }) => {
    const handleOutGroupModal = async () => {
      try {
        await Group.memberOutGroup(conversationId);
        router.push("/tinNhan");
        // console.log(conversationId);
        // window.location.reload();
        console.log("Out group successfully");
        onOk();
        notification.success({
          description: "Đã rời khỏi nhóm.",
        });
      } catch (error) {
        console.error("Error out group:", error);
        notification.error({
          description: "Phải chuyển quyền nhóm trưởng trước khi rời.",
        });
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
          <Button
            style={{
              border: "1px solid #ccc",
              backgroundColor: "#f5222d",
            }}
            key="confirm"
            type="danger"
            onClick={handleOutGroupModal}
          >
            Xác nhận
          </Button>,
        ]}
        title="Rời khỏi nhóm"
      >
        <p>Bạn có chắc chắn muốn rời khỏi nhóm?</p>
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
        <div
          style={{
            display: roleCurrentUser === "admin" ? "block" : "none",
          }}
        >
          <Button
            style={{
              border: "none",
              padding: "0px",
              background: "#fff",
            }}
            onClick={() => setTransferOwnershipModalVisible(true)}
          >
            Chuyển quyền trưởng nhóm
          </Button>
          <TransferOwnershipModal
            visible={transferOwnershipModalVisible}
            onCancel={() => setTransferOwnershipModalVisible(false)}
            members={members.filter((member) => member._id != currentUser.uid)}
            onTransferOwnership={handleTransferOwnership}
            onSave={() => setTransferOwnershipModalVisible(false)}
          />
        </div>
        <div
          style={{ display: roleCurrentUser === "admin" ? "block" : "none" }}
        >
          <div>
            <Button
              style={{
                border: "none",
                padding: "0px",
                background: "#fff",
              }}
              onClick={() => setAddGroupDeputyModalVisible(true)}
            >
              Thêm phó nhóm
            </Button>
          </div>

          <AddGroupDeputy
            visible={addGroupDeputyModalVisible}
            onCancel={() => setAddGroupDeputyModalVisible(false)}
            members={members.filter(
              (member) =>
                member._id != currentUser.uid && member.role != "deputy"
            )}
            onAddGroupDeputy={handleAddGroupDeputy}
            onSave={() => setAddGroupDeputyModalVisible(false)}
          />
        </div>

        <div
          style={{
            marginTop: "6px",
            display: roleCurrentUser === "" ? "none" : "block",
          }}
        >
          <span style={{ marginRight: "55px" }}>Duyệt Thành Viên</span>
          <Switch
            checkedChildren=""
            unCheckedChildren=""
            onClick={(checked) => {
              console.log("checked", checked);
              Group.update(conversationId, { memberModeration: checked });
              openNotificationWithIcon("success", "Success", "Đã cập nhật");
            }}
          />
        </div>
        {/* <div style={{ marginTop: "6px" }}>
          <span style={{ marginRight: "30px" }}>Quyền sửa thông tin </span>
          <Switch checkedChildren="" unCheckedChildren="" />
        </div> */}

        {/* <div style={{ marginTop: "6px" }}>
          <span style={{ marginRight: "40px" }}>Quyền gửi tin nhắn </span>
          <Switch checkedChildren="" unCheckedChildren="" />
        </div> */}
        <div
          style={{ display: roleCurrentUser === "admin" ? "block" : "none" }}
        >
          <Button
            style={{
              border: "none",
              padding: "0px",
              background: "#fff",
            }}
            onClick={() => setDisbandModalVisible(true)}
          >
            Giải tán nhóm
          </Button>
        </div>
        <div>
          <Button
            style={{ border: "none", padding: "0px", background: "#fff" }}
            onClick={() => setOutGroupModalVisible(true)}
          >
            Rời khỏi nhóm
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
      <OutGroupModal
        visible={outGroupModalVisible}
        onCancel={() => setOutGroupModalVisible(false)}
        onOk={() => setOutGroupModalVisible(false)}
        conversationId={conversationId}
      />
    </Modal>
  );
};

export default ModalSettingGroup;
