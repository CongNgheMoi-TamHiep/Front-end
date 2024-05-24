"use client";
import { AvatarGroup, Avatar } from "@mui/material";
import { Flex } from "antd";

const AvatarGroupFour = ({ members }) => {
  return (
    <>
      {members.length <= 2 && (
        <AvatarGroup spacing={"small"} sx={{ width: 60, height: 30 }}>
          {members.map((member, index) => (
            <Avatar
              key={index}
              alt={member.name}
              src={member.avatar}
              sx={{ width: 30, height: 30 }}
            />
          ))}
        </AvatarGroup>
      )}
      {members.length == 3 && (
        <div style={{ height: "60px", width: "60px", position: "relative" }}>
          {/* {members.map((member, index) => ( */}
          <Avatar
            key={1}
            alt={members[0].name}
            src={members[0].avatar}
            sx={{ width: 35, height: 35 }}
            style={{ position: "absolute", top: 1, left: 15 }}
          />
          <Avatar
            key={2}
            alt={members[1].name}
            src={members[1].avatar}
            sx={{ width: 35, height: 35 }}
            style={{ position: "absolute", bottom: 1, right: 0 }}
          />
          <Avatar
            key={3}
            alt={members[2].name}
            src={members[2].avatar}
            sx={{ width: 35, height: 35 }}
            style={{ position: "absolute", bottom: 1, left: 0 }}
          />
        </div>
      )}
      {members.length > 3 && (
        <div style={{ height: "60px", width: "60px", position: "relative" }}>
          {/* {members.map((member, index) => ( */}
          <Avatar
            key={1}
            alt={members[0].name}
            src={members[0].avatar}
            sx={{ width: 35, height: 35 }}
            style={{ position: "absolute", top: 1, left: 0 }}
          />
          <Avatar
            key={2}
            alt={members[1].name}
            src={members[1].avatar}
            sx={{ width: 35, height: 35 }}
            style={{ position: "absolute", top: 1, left: 30 }}
          />
          <Avatar
            key={3}
            alt={members[2].name}
            src={members[2].avatar}
            sx={{ width: 35, height: 35 }}
            style={{ position: "absolute", bottom: 1, left: 0 }}
          />
          {members.length == 4 ? (
            <Avatar
              key={4}
              alt={members[3].name}
              src={members[3]?.avatar}
              sx={{ width: 35, height: 35 }}
              style={{ position: "absolute", bottom: 1, left: 30 }}
            />
          ) : (
            <Flex
              style={{
                position: "absolute",
                bottom: 1,
                left: 30,
                height: "35px",
                width: "35px",
                backgroundColor: "gray",
                borderRadius: "50%",
              }}
              justify="center"
              align="center"
            >
              {members.length > 99 ? "99+" : members.length}
            </Flex>
          )}
        </div>
      )}
    </>
  );
};

export default AvatarGroupFour;
