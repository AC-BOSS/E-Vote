import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from './Register.module.css';

import { Link } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const submitHandler = async() => {
        console.log(email, password, isAdmin);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({email, password, isAdmin})
        })
        const data = await response.json();
        if(response.ok) {
            window.alert("A verification link has been sent to your email");
        } else {
            window.alert(data);
        }
    }
    return (
        <div className={styles.container}>
            <FormControl sx={{ width: '30%' }}>
                <Typography variant="h1" align="center" sx={{mb:2}}>Register</Typography>
                <TextField id="email" label="Email" variant="outlined" sx={{mb:2}} value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField id="password" label="Password" type="password" variant="outlined" sx={{mb:2}} value={password} onChange={(e) => setPassword(e.target.value)} />
                <FormControlLabel checked={isAdmin} control={<Radio/>} label="Admin Account" sx={{mb:2}} onClick={() => setIsAdmin(!isAdmin)} />
                <Button variant="contained" onClick={submitHandler}>Register</Button>
                <Link to="/login" className={styles.link}>Login</Link>
            </FormControl>
        </div>
    )
}