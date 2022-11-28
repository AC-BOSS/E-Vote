import React, {useState} from "react";
import styles from "./PollModal.module.css";

import { useNavigate } from "react-router-dom";

export default function PollModal(){
    const navigate = useNavigate();
    const [institution, setInstitution] = useState("");
    const [post, setPost] = useState("");
    const [startTime, setStartTime] = useState(new Date().toISOString());
    const [endTime, setEndTime] = useState(new Date().toISOString());

    const handleOnSubmit = async() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if(!accessToken) {
            navigate("/login");
        }
        console.log(startTime, endTime);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/poll/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            },
            body:JSON.stringify({post, institution, startTime, endTime})
        });
        
        const data = await response.json();
        if(response.status === 400) {
            window.alert(data);
        } else {
            window.location.reload(false);
        }
    }

    return(
        <div className={styles.pollModal}>
            <div className={styles.h1}>Create New Poll</div>
            <input
                className={styles.inputField}
                type="text"
                placeholder="Institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
            />
            <input
                className={styles.inputField}
                type="text"
                placeholder="Post"
                value={post}
                onChange={(e) => setPost(e.target.value)}
            />
            <label htmlFor="startTime">Start Date and Time:</label>
            <input type="datetime-local" id="startTime" name="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)}></input>

            <label htmlFor="endTime">Start Date and Time:</label>
            <input type="datetime-local" id="endTime" name="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)}></input>

            <div className={styles.submitBtn} onClick={handleOnSubmit}>
                Create Poll
            </div>
        </div>
    );
}