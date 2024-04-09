"use client";
import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Image from "next/image";
import FriendRequest from "@/apis/friendRequest";
import { AuthContext } from "@/context/AuthProvider";
import imageDefault from "@/constants/imgDefault";
import { Modal } from "antd";
import Button from "@/components/Button";
import openNotificationWithIcon from "@/components/OpenNotificationWithIcon";
import { set } from "date-fns";

const FriendRequestPage = () => {
  // const items = [
  //   {
  //     id: 1,
  //     name: "Lê Thanh Tùng",
  //     image:
  //       "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
  //   },
  //   {
  //     id: 2,
  //     name: "Lê Hữu Hiệp",
  //     image:
  //       "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
  //   },
  //   {
  //     id: 3,
  //     name: "Nguyễn Khánh An",
  //     image:
  //       "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
  //   },
  //   {
  //     id: 4,
  //     name: "Lò Văn Tủn",
  //     image:
  //       "https://media.licdn.com/dms/image/D4E0BAQG-i2j7Q2WFIA/company-logo_200_200/0/1694593112031/img_logo?e=2147483647&v=beta&t=o1304VK0Zbh3CBA-8_LNYNZZCNrQjMIBS-nwKrAMzbY",
  //   },
  // ];

  const [friendRequestReceived, setFriendRequestReceived] = useState([]);
  const [friendRequestSend, setFriendRequestSend] = useState([]);
  const [openModel, setOpenModel] = useState(undefined);
  const currentUser = useContext(AuthContext);
  // console.log(currentUser);

  useEffect(() => {
    const fetch = async () => {
      const dataReceived = await FriendRequest.getFriendRequestReceived(
        currentUser.uid
      );
      setFriendRequestReceived(dataReceived);

      const dataSend = await FriendRequest.getFriendRequestSend(
        currentUser.uid
      );
      setFriendRequestSend(dataSend);
    };
    fetch();
  }, []);

  return (
    <div>
      {friendRequestReceived.length !== 0 && (
        <h4 className="pTitleFR">
          Request received ({friendRequestReceived.length})
        </h4>
      )}
      <div className="containerFR">
        {friendRequestReceived.map((item, index) => (
          <div className="itemFR" key={index}>
            <div className="topItemFR">
              <img
                className="imageFR"
                src={item.avatar || imageDefault}
                alt=""
              />
              <p className="nameFR">{item.name}</p>
            </div>
            <div className="bottomItemFR">
              <span>Xin chào, mình là {item.name}. Kết bạn cùng mình nhé!</span>
            </div>
            <div className="buttonItemFR">
              <button
                className="btn declineFR"
                onClick={() => setOpenModel({ status: 0, id: item._id })}
              >
                Decline
              </button>
              <button
                className="btn acceptFR"
                onClick={() => setOpenModel({ status: 1, id: item._id })}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>

      {friendRequestSend.length !== 0 && (
        <h4 className="pTitleFR">Request send ({friendRequestSend.length})</h4>
      )}
      <div className="containerFR">
        {friendRequestSend.map((item, index) => (
          <div className="itemFR" key={index}>
            <div className="topItemFR">
              <img
                className="imageFR"
                src={item.avatar || imageDefault}
                alt=""
              />
              <p className="nameFR">{item.name}</p>
            </div>
            <div className="bottomItemFR">
              <span>Invitation has been sent to this person</span>
            </div>
            <div className="buttonItemFR">
              <button
                className="btn"
                style={{ backgroundColor: "#A9ACB0", border: "none" }}
                onClick={() => setOpenModel({ status: 2, id: item._id })}
              >
                Cancel request
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={<h3>{openModel?.status == 2 ? "Cancel request" : "Confirm"}</h3>}
        open={openModel && true}
        footer={null}
        onCancel={() => setOpenModel(undefined)}
      >
        <p
          style={{
            // padding: "10px 0",
            paddingTop: "10px",
            fontSize: "16px",
            borderTop: "1px solid #A9ACB0",
          }}
        >
          {openModel?.status == 2
            ? "Are you sure you want to cancel this request"
            : openModel?.status == 1
            ? "Are you sure you want to accept this request"
            : "Are you sure you want to decline this request"}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          {openModel?.status !== 2 ? (
            <>
              <Button
                padding="10px 15px"
                bgColorHover="#A9ACB0"
                bgColor="#EAEDF0"
                onClick={() => setOpenModel(undefined)}
              >
                No
              </Button>
              <Button
                padding="10px 15px"
                bgColorHover="#A9ACB0"
                bgColor="#C7E0FF"
                color="#005AE0"
                onClick={() => {
                  setFriendRequestReceived(
                    friendRequestReceived.filter(
                      (item) => item._id !== openModel.id
                    )
                  );
                  openModel.status == 0
                    ? FriendRequest.declineFriendRequest(openModel.id)
                    : FriendRequest.acceptFriendRequest(openModel.id);
                  openNotificationWithIcon(
                    "success",
                    "Success",
                    `Success ${
                      openModel?.status == 0 ? "decline" : "accept"
                    } request to friend`
                  );
                  setOpenModel(undefined);
                }}
              >
                {openModel?.status == 0 ? "Decline" : "Accept"}
              </Button>
            </>
          ) : (
            <>
              <Button
                padding="10px 15px"
                bgColorHover="#A9ACB0"
                bgColor="#EAEDF0"
                onClick={() => setOpenModel(undefined)}
              >
                No
              </Button>
              <Button
                padding="10px 15px"
                bgColorHover="#A9ACB0"
                bgColor="#eb4b4b"
                color="white"
                onClick={() => {
                  setFriendRequestSend(
                    friendRequestSend.filter(
                      (item) => item._id !== openModel.id
                    )
                  );
                  FriendRequest.cancalRequest(openModel.id);
                  openNotificationWithIcon(
                    "success",
                    "Cancel request",
                    "Cancel request to friend"
                  );
                  setOpenModel(undefined);
                }}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FriendRequestPage;
