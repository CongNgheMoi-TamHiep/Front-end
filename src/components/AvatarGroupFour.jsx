"use client";
import { AvatarGroup, Avatar } from "@mui/material";

const AvatarGroupFour = ({members}) => {
  return (
    <AvatarGroup max={4} spacing={"small"} sx={{ width: 60, height: 30 }} >
      {members.map((member, index) => (
        <Avatar
          key={index}
          alt={member.name}
          src={member.avatar}
          sx={{ width: 30, height: 30 }}
        />
      ))}
    </AvatarGroup>
  );
};

export default AvatarGroupFour;
// 'circular'
// | 'rounded'
// | 'square'
// | string