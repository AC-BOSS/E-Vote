import React, { useState } from "react";
import { TextField, Radio, FormControlLabel, FormControl, Button } from '@mui/material';

export default function Login() {
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
        console.log(data);
        // .then((res) => console.log(res.json()))
        // .catch((err) => console.log(err));
    }
    return (
        <FormControl>
			<TextField id="email" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
			<TextField id="password" label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
            <FormControlLabel checked={isAdmin} control={<Radio/>} label="Admin Account" onClick={() => setIsAdmin(!isAdmin)} />
            <Button variant="contained" onClick={submitHandler}>Register</Button>
		</FormControl>
    )
}