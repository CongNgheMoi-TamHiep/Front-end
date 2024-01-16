"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import "./styles.scss";
import { AuthContext } from "@/context/AuthProvider";
import Loading from "@/components/Loading";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import formatPhoneNumber  from '@/utils/formatPhoneNumber'
import { format } from "path";
import axios from '@/api/axios'
import { axiosPrivate } from "@/api/axios";
function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Zola
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [number, setNumber] = useState("");
    const [confirmation, setConfirmation] = useState(null);
    const [otp, setOtp] = useState("");
    const [isCheck, setIsCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const recaptchaVerifier = React.useRef(null);
    const currentUser = React.useContext(AuthContext); 

    useEffect(()=> { 
      if(currentUser) 
        setIsAuthenticated(true) 
      else
        setIsAuthenticated(false)
      setIsLoading(false);
    }, [currentUser])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const recaptcha = new RecaptchaVerifier(
                auth,
                recaptchaVerifier.current,
                {}
            );
            setIsCheck(true);
            const confirmation = await signInWithPhoneNumber(auth, number, recaptcha);
            setConfirmation(confirmation);
        } catch (error) {
            console.log(error);
        }
    };

    const verifyOtp = async () => {
        try {
            const result = await confirmation.confirm(otp);
            const user = result.user;
            const email = `${formatPhoneNumber(number)}@gmail.com`;
            const credential = EmailAuthProvider.credential(email, password);
            try {
                const usercred = await linkWithCredential(user, credential);
                const user2 = usercred.user;
                const userInfo = {
                    _id: user2.uid,
                    name,
                    number: user2.phoneNumber, 
                    avatar: "https://images.pexels.com/photos/14940646/pexels-photo-14940646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                }
                // call register API to server
                await axiosPrivate.post('/auth/register', {
                    userInfo, 
                    accessToken: user2.accessToken, 
                    refreshToken: user2.refreshToken
                })

                await axiosPrivate.post('/userConversations', {
                    userId: user2.uid, 
                    conversations: [],
                })

                setIsAuthenticated(true);
                console.log("Account linking success", user2);
            } catch (error) {
                console.log("Account linking error", error);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return <Loading />;
    }
    if (isAuthenticated) {
        router.push("/");
        return <Loading />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {isCheck ? (
                    <div>
                        {confirmation && (
                            <div className="otp">
                                <TextField
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && verifyOtp()
                                    }
                                    onChange={(e) => setOtp(e.target.value)}
                                    value={otp}
                                    sx={{ marginTop: "10px", width: "300px" }}
                                    variant="outlined"
                                    size="smail"
                                    label="Enter the code"
                                />
                                <Button
                                    onClick={verifyOtp}
                                    variant="contained"
                                    color="success"
                                >
                                    Verify otp
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        {confirmation ? (
                            <div className="otp">
                                {!confirmation && <div ref={recaptchaVerifier}></div>}
                                {confirmation && (
                                    <div>
                                        <TextField
                                            onChange={(e) =>
                                                setOtp(e.target.value)
                                            }
                                            value={otp}
                                            sx={{
                                                marginTop: "10px",
                                                width: "300px",
                                            }}
                                            variant="outlined"
                                            size="smail"
                                            label="Enter the code"
                                        />
                                        <Button
                                            onClick={verifyOtp}
                                            variant="contained"
                                            color="success"
                                        >
                                            Verify otp
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit}
                                sx={{ mt: 3 }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="name"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Name"
                                            autoFocus
                                            value={name}
                                            onChange={(e)=>setName(e.target.value)} 
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MuiTelInput
                                            defaultCountry={"VN"}
                                            value={number}
                                            onChange={setNumber}
                                            required
                                            fullWidth
                                            id="phone"
                                            label="Phone number"
                                            name="phone"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e)=>setPassword(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value="allowExtraEmails"
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <>
                                                    I agree to{" "}
                                                    <Link href="https://zalo.vn/dieukhoan/">
                                                        Zola&apos;s terms
                                                    </Link>
                                                </>
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link href="/login" variant="body2">
                                            Already have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                )}
                {!confirmation && (
                    <div className="recaptcha" ref={recaptchaVerifier}></div>
                )}
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
