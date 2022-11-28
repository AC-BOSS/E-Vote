import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from './Login.module.css';

import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({email, password})
        })
        const data = await response.json();
        if(response.ok) {
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("isAdmin", data.isAdmin);
            navigate("/");
        } else {
            window.alert(data);
            // console.log(data);
        }
    }
    return (
        <div className={styles.container}>
            <FormControl sx={{ width: '30%' }}>
                <Typography variant="h1" align="center" sx={{mb:2}}>Login</Typography>
                <TextField id="email" label="Email" variant="outlined" sx={{mb:2}} value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField id="password" label="Password" type="password" variant="outlined" sx={{mb:2}} value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={submitHandler}>Login</Button>
                <Link to="/register" className={styles.link}>Create Account</Link>
            </FormControl>
        </div>
    )
}