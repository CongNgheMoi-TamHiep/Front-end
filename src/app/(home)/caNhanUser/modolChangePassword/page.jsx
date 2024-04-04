// import "style.scss";

import React, { useState } from "react";
import { Modal } from "antd";
import { Box, Grid, TextField, Button } from "@mui/material";
import openNotificationWithIcon from "@/components/OpenNotificationWithIcon";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useCurrentUser } from "@/context/AuthProvider";

const ModalChangePassword = ({ show, handleClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInValidOldPassword, setIsInValidOldPassword] = useState(false);
  const [isInValidNewPassword, setIsInValidNewPassword] = useState(false);
  const [isInValidConfirmPassword, setIsInValidConfirmPassword] =
    useState(false);
  const currentUser = useCurrentUser();
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdatePassword(password);
  };

  const handleUpdatePassword = async () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      openNotificationWithIcon("error", "Error", "Please fill all fields");
      setIsInValidOldPassword(oldPassword === "");
      setIsInValidNewPassword(newPassword === "");
      setIsInValidConfirmPassword(confirmPassword === "");
      return;
    }
    if (
      isInValidOldPassword ||
      isInValidNewPassword ||
      isInValidConfirmPassword
    ) {
      openNotificationWithIcon("error", "Error", "Information is invalid");
      return;
    }
    try {
      const credential = await EmailAuthProvider.credential( currentUser.email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // old password is correct here 
      await updatePassword(currentUser, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      openNotificationWithIcon("success", "Success", "Password changed successfully");
      handleClose();
    } catch (error) {
      setIsInValidOldPassword(true); 
    }
  };

  const checkOldPassword = (e) => {
    setOldPassword(e.target.value);
  };

  const checkNewPassword = (e) => {
    setNewPassword(e.target.value);
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_+=|\\{}\[\]:;'"<>,.?/])[A-Za-z\d!@#$%^&*()-_+=|\\{}\[\]:;'"<>,.?/]{8,}$/;
    if (!regex.test(e.target.value) && e.target.value !== "") {
      setIsInValidNewPassword(true);
    } else {
      setIsInValidNewPassword(false);
    }

    if (confirmPassword !== "" && confirmPassword !== e.target.value) {
      setIsInValidConfirmPassword(true);
    }

    if (confirmPassword !== "" && confirmPassword === e.target.value) {
      setIsInValidConfirmPassword(false);
    }
  };

  const checkConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (newPassword !== e.target.value && e.target.value !== "") {
      setIsInValidConfirmPassword(true);
    } else {
      setIsInValidConfirmPassword(false);
    }
  };
  return (
    <Modal
      open={show}
      title={<h3>CHANGE PASSWORD</h3>}
      onCancel={handleClose}
      footer={[
        <Button
          key="back"
          variant="outlined"
          onClick={handleClose}
          style={{ marginRight: "5px" }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          variant="contained"
          color="success"
          onClick={handleUpdatePassword}
        >
          Update
        </Button>,
      ]}
    >
      <Box component="form" noInValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <Grid container spacing={2} style={{ marginTop: "5px" }}>
          <Grid item xs={12}>
            <TextField
              error={isInValidOldPassword}
              helperText={isInValidOldPassword && "Old password is incorrect"}
              required
              fullWidth
              name="oldPassword"
              label="Old Password"
              type="password"
              id="oldPassword"
              autoComplete="new-password"
              value={oldPassword}
              onChange={checkOldPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={isInValidNewPassword}
              helperText={
                isInValidNewPassword &&
                "Password incluces 1 uppercase letter, 1 lowercase letter, and 1 number, may contain special characters (8-16 characters long)"
              }
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={checkNewPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={isInValidConfirmPassword}
              helperText={
                isInValidConfirmPassword && "Password confirm do not match"
              }
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={checkConfirmPassword}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ModalChangePassword;
