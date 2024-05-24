import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Image,
  Upload,
  Tooltip,
  List,
  Button,
  Flex,
  Input,
} from "antd";
import { useTranslation } from "react-i18next";
import { format, set } from "date-fns";
import Group from "@/apis/Group";
import imageDefault from "@/constants/imgDefault";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { AuthContext } from "@/context/AuthProvider";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const ModalProfileUser = ({ isOpen, onClose, user }) => {
  const { t } = useTranslation();
  const currentUser = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nameNew12, setNameNew] = useState(user?.name);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        Group.getMembers(user?._id).then((response) => {
          // console.log("response", response);
          currentUser.role = response.filter(
            (member) => member._id == currentUser.uid
          )[0].role;
          setMembers(response);
        });
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    user?.type == "group" && fetchMembers();
  }, [user]);

  const handleImgChange = async ({ file }) => {
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result);
    // reader.onerror = (error) => reject(error);
    try {
      const fmData = new FormData();
      fmData.append("file", file);
      // await userApis.updateAvatar(currentUser?.uid, fmData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeNameGroup = () => {
    console.log("value", nameNew12);
    setOpenModal(false);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={"33.3333%"}
      // maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
    >
      <div>
        <Typography.Title level={4}>{t("personal_info")}</Typography.Title>
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
            position: "relative",
          }}
        >
          <Image
            src={user?.avatar || user?.image || imageDefault}
            alt={user?.name}
            width={60}
            height={60}
            style={{ borderRadius: "50%", borderWidth: "1px" }}
          />
          <Typography.Title
            level={4}
            style={{ fontSize: "20px", marginTop: "14px" }}
          >
            {user?.name}
          </Typography.Title>
          <Button
            style={{
              backgroundColor: "gray",
              borderRadius: "50%",
              marginTop: "10px",
            }}
            icon={<BorderColorIcon fontSize="5px" />}
            onClick={() => setOpenModal(true)}
          />
          {user?.type == "group" && (
            <Upload
              maxCount={1}
              accept="image/*"
              progress
              customRequest={handleImgChange}
              showUploadList={false}
            >
              <Tooltip
                placement="right"
                title={t("change_avatar")}
                arrow={false}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "gray",
                    position: "absolute",
                    top: 40,
                    left: 40,
                  }}
                >
                  <CameraAltIcon />
                </div>
              </Tooltip>
            </Upload>
          )}
        </div>
        {user?.type !== "group" && (
          <>
            <div
              style={{
                paddingBottom: "10px",
                borderBottom: "3px solid #ccc",
                marginLeft: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography.Title level={5}>
                {t("personal_info")}
              </Typography.Title>

              <Typography.Text style={{ fontSize: "16px" }}>
                {t("gender")}:{" "}
                <span style={{ marginLeft: "39px" }}>{user?.gender}</span>
              </Typography.Text>
              <Typography.Text style={{ fontSize: "16px" }}>
                {t("date_of_birth")}:{" "}
                <span style={{ marginLeft: "30px" }}>
                  {user?.dateOfBirth
                    ? format(new Date(user?.dateOfBirth), "dd/MM/yyyy")
                    : t("no_info")}
                </span>
              </Typography.Text>
              <Typography.Text style={{ fontSize: "16px" }}>
                {t("phone")}:{" "}
                <span style={{ marginLeft: "6px" }}>{user?.number}</span>
              </Typography.Text>
            </div>
            <div
              style={{
                paddingBottom: "10px",
                marginLeft: "10px",
                marginTop: "10px",
              }}
            >
              <Typography.Title level={5}>
                {t("change_avatar")}
              </Typography.Title>
              <Typography.Text style={{ fontSize: "16px" }}>
                {t("no_info")}
              </Typography.Text>
            </div>
          </>
        )}
        {user?.type === "group" && (
          <div
            style={{
              height: 200,
              overflow: "auto",
              padding: "0 16px",
              border: "1px solid #ccc",
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
                      key={member._id}
                      style={{
                        display:
                          currentUser.role === "member" ? "none" : "block",
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
        )}
      </div>
      <Modal
        title="Sửa tên nhóm"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleChangeNameGroup}
      >
        <Input
          value={nameNew12}
          defaultValue={user?.name}
          onChange={(e) => setNameNew(e.target.value)}
          placeholder="Nhập tên nhóm"
        />
      </Modal>
    </Modal>
  );
};

export default ModalProfileUser;
